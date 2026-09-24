/**
 * The advisor's tools: everything it is able to do, and nothing else.
 *
 * This file is the security boundary, not the prompt. A prompt is a request; a
 * tool surface is a fact. There is deliberately no tool here that writes an
 * answer, changes eligibility, submits, reopens, or touches the determination —
 * so no wording in a model's output, and no instruction smuggled into a client's
 * justification text, can reach any of those. The single writing tool collects
 * remediation items in memory, and the caller decides whether they are ever
 * persisted.
 *
 * Every input is validated here even though the tool definitions are declared
 * strict. Strict schemas are enforced by the API, which is the right place for
 * them and the wrong place to rely on: the values end up in Postgres and in a
 * PDF, and a generation truncated by a token limit can still arrive well-formed
 * and wrong.
 */
import { getQuestion, getQuestions, VARIANTS } from '../../shared/questions/index.js';
import { RESPONSES, DETERMINATIONS } from '../../shared/scoring.js';
import { SAQ_TYPES } from '../../shared/eligibility.js';

/** Caps on what one item may carry into the database and into a report. */
export const LIMITS = {
  summary: 1200,
  steps: 6000,
  evidence: 2000,
  effort: 200,
  owner_role: 200,
  related: 1000,
  overview: 6000,
  query: 200,
  searchResults: 12,
};

export const TOOL_DEFINITIONS = [
  {
    name: 'list_gaps',
    description:
      'The requirements this assessment did not pass, as scored by the tool: every one answered "No", every one resting on a compensating control, and every one whose mandatory justification is missing. Includes whatever note the client wrote. Call this first; it is the authoritative work list.',
    strict: true,
    input_schema: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
  {
    name: 'get_assessment_context',
    description:
      'Who is being assessed and against what: the SAQ edition, the scope the client described, the response counts, and the determination the tool computed. Use it to pitch the plan at the right entity; the determination is given so you know what has already been decided, not so you can restate or revise it.',
    strict: true,
    input_schema: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
  {
    name: 'get_requirement',
    description:
      'The verbatim PCI DSS v4.0.1 text for one requirement id, with its testing procedures, as this tool holds it. Call this for every requirement you write about, and reason from what it returns rather than from memory.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'A requirement id such as "8.3.6" or "A1.1.1".' },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
  {
    name: 'search_requirements',
    description:
      'Keyword search across the requirement titles and text of this SAQ edition. Use it to find requirements related to a gap — the neighbouring controls that remediation has to cover too — and to check whether they were also answered.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Words to look for, for example "multi-factor" or "key rotation".' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'save_remediation_item',
    description:
      'Record the draft remediation for one gap. Call it once per gap in list_gaps. Calling it again for the same requirement replaces what you saved before.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        question_id: { type: 'string', description: 'The requirement id this item remediates. Must be one from list_gaps.' },
        priority: {
          type: 'integer',
          description: 'Sequence position, 1 first. Order by risk and dependency, not by requirement number.',
        },
        summary: { type: 'string', description: 'One or two sentences: what is wrong and what closing it means.' },
        steps: { type: 'string', description: 'The ordered, concrete actions. One per line, numbered.' },
        evidence: { type: 'string', description: "What the assessor should ask to see, from the requirement's testing procedures." },
        effort: { type: 'string', description: 'Rough effort and elapsed time for a mid-sized entity.' },
        owner_role: { type: 'string', description: 'The role that should own it, for example "Network engineering".' },
        related: { type: 'string', description: 'Other requirement ids this depends on or travels with, and why. Empty if none.' },
      },
      required: ['question_id', 'priority', 'summary', 'steps', 'evidence', 'effort', 'owner_role', 'related'],
      additionalProperties: false,
    },
  },
];

/** A tool call the model got wrong. Returned to it as an error result so it can
 *  correct itself, rather than thrown, which would end the run. */
class ToolInputError extends Error {}

function requireString(input, field, { max, required = true }) {
  const value = input?.[field];
  if (value === undefined || value === null || value === '') {
    if (required) throw new ToolInputError(`${field} is required.`);
    return '';
  }
  if (typeof value !== 'string') throw new ToolInputError(`${field} must be a string.`);
  if (value.length > max) {
    throw new ToolInputError(`${field} is ${value.length} characters; the limit is ${max}. Shorten it and call again.`);
  }
  return value.trim();
}

/**
 * Builds the handlers for one run.
 *
 * `scored` is the output of scoreAssessment — the deterministic result. The
 * advisor is handed that result rather than the answers table, so the only view
 * it has of the assessment is the one the scorer already settled.
 */
export function createToolHandlers({ assessment, scored, collected }) {
  const variant = assessment.variant;

  /** Everything the advisor is expected to write an item for, keyed by id. */
  const workList = new Map();
  for (const gap of scored.gaps) workList.set(gap.id, { ...gap, response: 'no' });
  for (const item of scored.reviewItems) workList.set(item.id, item);
  for (const item of scored.missingJustification) {
    if (!workList.has(item.id)) workList.set(item.id, item);
  }

  function describe(entry) {
    return {
      id: entry.id,
      title: entry.title,
      section: `Requirement ${entry.sectionId}: ${entry.sectionTitle}`,
      client_response: RESPONSES[entry.response]?.label ?? 'No',
      client_note: entry.justification || '(the client left no note)',
      evidence_reference: entry.evidence || '',
      needs_justification_but_has_none: scored.missingJustification.some((m) => m.id === entry.id),
    };
  }

  const handlers = {
    list_gaps() {
      return {
        count: workList.size,
        note:
          'Write one save_remediation_item for each entry below. "Yes with Compensating Control" entries are not ' +
          'failures: the remediation there is what the entity would need in order to stop depending on the ' +
          'compensating control, plus what the assessor needs to validate the worksheet.',
        gaps: [...workList.values()].map(describe),
      };
    },

    get_assessment_context() {
      return {
        entity: assessment.client_name,
        doing_business_as: assessment.dba || '',
        saq_edition: VARIANTS[variant]?.label ?? variant,
        saq_type: assessment.saq_type ? (SAQ_TYPES[assessment.saq_type]?.name ?? assessment.saq_type) : null,
        scope_described_by_client: assessment.scope_summary || '(the client described no scope)',
        determination: {
          key: scored.determination,
          label: DETERMINATIONS[scored.determination].label,
          note: 'Computed by the tool from the client\'s answers. Not yours to restate, revise, or predict.',
        },
        counts: scored.totals.counts,
        applicable_requirements: scored.totals.total,
        status: assessment.status,
      };
    },

    get_requirement(input) {
      const id = requireString(input, 'id', { max: 32 });
      const question = getQuestion(variant, id);
      if (!question) {
        throw new ToolInputError(
          `There is no requirement "${id}" in the ${VARIANTS[variant]?.label ?? variant} edition. ` +
            'Use search_requirements to find the right id.'
        );
      }
      const answer = scored.gaps
        .concat(scored.reviewItems, scored.naItems, scored.unanswered)
        .find((e) => e.id === id);
      return {
        id: question.id,
        title: question.title,
        section: `Requirement ${question.sectionId}: ${question.sectionTitle}`,
        saq_question: question.question,
        requirement_text: question.requirement,
        testing_procedures: question.testing,
        not_applicable_permitted: question.allowNA,
        applies_to: question.appliesTo,
        // Enough for the advisor to see whether a neighbouring requirement is
        // also a problem, without handing it the answers table.
        this_entity_answered: answer
          ? scored.unanswered.some((u) => u.id === id)
            ? 'unanswered'
            : (RESPONSES[answer.response]?.label ?? 'No')
          : 'In place (Yes)',
      };
    },

    search_requirements(input) {
      const query = requireString(input, 'query', { max: LIMITS.query });
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      if (terms.length === 0) throw new ToolInputError('query is empty.');

      const scoredHits = getQuestions(variant)
        .map((q) => {
          const haystack = `${q.id} ${q.title} ${q.question} ${q.requirement}`.toLowerCase();
          const hits = terms.filter((t) => haystack.includes(t)).length;
          return { q, hits };
        })
        .filter((entry) => entry.hits > 0)
        .sort((a, b) => b.hits - a.hits || a.q.id.localeCompare(b.q.id))
        .slice(0, LIMITS.searchResults);

      return {
        query,
        matched: scoredHits.length,
        truncated: scoredHits.length === LIMITS.searchResults,
        results: scoredHits.map(({ q }) => ({
          id: q.id,
          title: q.title,
          section: `Requirement ${q.sectionId}`,
          requirement_text: q.requirement,
          is_a_gap_in_this_assessment: workList.has(q.id),
        })),
      };
    },

    save_remediation_item(input) {
      const questionId = requireString(input, 'question_id', { max: 32 });
      if (!workList.has(questionId)) {
        throw new ToolInputError(
          `"${questionId}" is not one of the gaps in this assessment, so it has nothing to remediate. ` +
            'Call list_gaps and use an id from it.'
        );
      }
      const priority = Number(input?.priority);
      if (!Number.isInteger(priority) || priority < 1 || priority > 999) {
        throw new ToolInputError('priority must be a whole number from 1 upwards.');
      }

      const item = {
        question_id: questionId,
        priority,
        summary: requireString(input, 'summary', { max: LIMITS.summary }),
        steps: requireString(input, 'steps', { max: LIMITS.steps }),
        evidence: requireString(input, 'evidence', { max: LIMITS.evidence }),
        effort: requireString(input, 'effort', { max: LIMITS.effort, required: false }),
        owner_role: requireString(input, 'owner_role', { max: LIMITS.owner_role, required: false }),
        related: requireString(input, 'related', { max: LIMITS.related, required: false }),
      };
      collected.set(questionId, item);

      const outstanding = [...workList.keys()].filter((id) => !collected.has(id));
      return {
        saved: questionId,
        items_saved: collected.size,
        gaps_still_without_an_item: outstanding,
        // Told plainly, because a run that stops early leaves gaps with no
        // advice at all and the assessor cannot see what is missing.
        next: outstanding.length
          ? `${outstanding.length} gap(s) still need an item.`
          : 'Every gap now has an item. Write the overview and stop.',
      };
    },
  };

  return { handlers, workList };
}

export { ToolInputError };
