/**
 * The loop.
 *
 * A model is given the tools in ./tools.js and left to work: it decides what to
 * look up, how many requirements to read, when it has enough, and when it is
 * done. That is the part of this tool that is agentic, and it is deliberately
 * the only part. Nothing here computes or influences a determination; the loop
 * runs after the scorer has already reached one, and its output is advice about
 * the gaps the scorer found.
 *
 * Written as an explicit loop rather than with the SDK's tool runner. The runner
 * would be less code, but every iteration here has to be recorded for audit,
 * every tool input re-validated before it reaches Postgres, and the whole thing
 * bounded — and the loop that does all three is short enough to read in one
 * sitting, which matters more in a compliance tool than brevity does.
 */
import Anthropic from '@anthropic-ai/sdk';
import { PROMPT_VERSION, SYSTEM_PROMPT } from './prompt.js';
import { TOOL_DEFINITIONS, createToolHandlers, LIMITS, ToolInputError } from './tools.js';

export const DEFAULT_MODEL = 'claude-opus-5';

/** A fallback model for the rare case where the primary declines the request. */
const FALLBACK_MODEL = 'claude-opus-4-8';
const FALLBACK_BETA = 'server-side-fallback-2026-06-01';

/**
 * How many model turns one run may take.
 *
 * A full SAQ D assessment can fail dozens of requirements, and the advisor reads
 * the text of each before writing about it, so this has to be generous. It still
 * has to exist: without it a model that keeps searching and never saves would
 * bill indefinitely and produce nothing.
 */
const MAX_ITERATIONS = Number(process.env.AGENT_MAX_ITERATIONS) || 40;
const MAX_TOKENS = 32_000;

/** How much of a tool result is kept in the stored transcript, per call. */
const TRANSCRIPT_RESULT_CHARS = 2_000;

export function agentModel() {
  return process.env.AGENT_MODEL || DEFAULT_MODEL;
}

/**
 * Whether the advisor can run at all.
 *
 * No key, no advisor — and the rest of the tool is unaffected. That is the point
 * of keeping the scorer and the advisor apart: a deployment with no model access
 * still administers questionnaires, scores them and issues reports, exactly as
 * it did before any of this existed.
 */
export function agentConfigured() {
  return typeof process.env.ANTHROPIC_API_KEY === 'string' && process.env.ANTHROPIC_API_KEY.trim() !== '';
}

export class AgentUnavailableError extends Error {}

function defaultClient() {
  if (!agentConfigured()) {
    throw new AgentUnavailableError(
      'ANTHROPIC_API_KEY is not set, so the remediation advisor is switched off. Set it to enable drafting; ' +
        'everything else in this tool works without it.'
    );
  }
  return new Anthropic();
}

/** The one thing the advisor is asked to do, in the first user turn. */
function kickoff(assessment, scored) {
  const gapCount =
    scored.gaps.length +
    scored.reviewItems.length +
    scored.missingJustification.filter(
      (m) => !scored.gaps.some((g) => g.id === m.id) && !scored.reviewItems.some((r) => r.id === m.id)
    ).length;

  return (
    `Draft the remediation plan for ${assessment.client_name}. The tool has scored their self-assessment and found ` +
    `${gapCount} requirement(s) that did not pass. Start with list_gaps and get_assessment_context, read the text of ` +
    'each requirement before you write about it, and save an item for every gap. Finish with the overview.'
  );
}

/**
 * Runs one drafting session.
 *
 * `client` is injectable so the loop can be exercised against a stub: the
 * suites cover ordering, the iteration ceiling, and what happens to a malformed
 * or out-of-scope tool call, none of which should need a paid API call or a
 * network to verify.
 *
 * @returns {Promise<{overview: string, items: object[], transcript: object[],
 *   iterations: number, usage: {input_tokens: number, output_tokens: number},
 *   stopReason: string, model: string, promptVersion: string,
 *   unaddressed: string[]}>}
 */
export async function runRemediationAgent({ assessment, scored, client = null, signal = null }) {
  const anthropic = client || defaultClient();
  const model = agentModel();
  const collected = new Map();
  const { handlers, workList } = createToolHandlers({ assessment, scored, collected });

  const messages = [{ role: 'user', content: kickoff(assessment, scored) }];
  const transcript = [];
  const usage = { input_tokens: 0, output_tokens: 0 };
  let overview = '';
  let iterations = 0;
  let stopReason = 'incomplete';

  while (iterations < MAX_ITERATIONS) {
    if (signal?.aborted) throw new Error('The run was cancelled.');
    iterations += 1;

    const response = await createMessage(anthropic, { model, messages });

    usage.input_tokens += response.usage?.input_tokens ?? 0;
    usage.output_tokens += response.usage?.output_tokens ?? 0;
    stopReason = response.stop_reason ?? 'unknown';

    // Checked before any tool runs. A turn cut off by the token ceiling can
    // carry a tool call whose arguments were never finished, and a refusal
    // carries no usable content at all.
    if (stopReason === 'refusal') {
      const detail = response.stop_details?.explanation || response.stop_details?.category || '';
      throw new Error(`The model declined to draft this plan${detail ? `: ${detail}` : '.'}`);
    }
    if (stopReason === 'max_tokens') {
      throw new Error(
        'The model hit its output limit part-way through a turn, so the plan is incomplete and has been discarded. ' +
          'Try again; if it keeps happening, the assessment has more gaps than one run can carry.'
      );
    }

    const thinking = response.content
      .filter((block) => block.type === 'thinking' && block.thinking)
      .map((block) => block.thinking)
      .join('\n');
    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();
    const toolCalls = response.content.filter((block) => block.type === 'tool_use');

    // Echoed back whole, thinking blocks included: the model is continuing its
    // own turn and they belong to it.
    messages.push({ role: 'assistant', content: response.content });

    const entry = { iteration: iterations, reasoning: thinking || undefined, text: text || undefined, calls: [] };

    if (toolCalls.length === 0) {
      // Nothing left to call, so this turn is the advisor's closing word.
      if (text) overview = text.slice(0, LIMITS.overview);
      transcript.push(entry);
      break;
    }

    // Every result goes back in one user message. Splitting them teaches the
    // model to stop calling tools in parallel.
    const results = [];
    for (const call of toolCalls) {
      const handler = handlers[call.name];
      let result;
      let isError = false;

      if (!handler) {
        result = { error: `There is no tool called "${call.name}".` };
        isError = true;
      } else {
        try {
          result = handler(call.input || {});
        } catch (err) {
          if (!(err instanceof ToolInputError)) throw err;
          result = { error: err.message };
          isError = true;
        }
      }

      const serialised = JSON.stringify(result);
      entry.calls.push({
        tool: call.name,
        input: call.input ?? {},
        ok: !isError,
        result: serialised.length > TRANSCRIPT_RESULT_CHARS ? `${serialised.slice(0, TRANSCRIPT_RESULT_CHARS)}…` : serialised,
      });
      results.push({ type: 'tool_result', tool_use_id: call.id, content: serialised, is_error: isError });
    }

    transcript.push(entry);
    messages.push({ role: 'user', content: results });
  }

  if (iterations >= MAX_ITERATIONS && stopReason === 'tool_use') {
    throw new Error(
      `The advisor was still working after ${MAX_ITERATIONS} turns and was stopped. Nothing has been saved. ` +
        'Raise AGENT_MAX_ITERATIONS if this assessment is unusually large.'
    );
  }
  if (collected.size === 0) {
    throw new Error('The advisor finished without drafting anything, so there is no plan to save.');
  }

  return {
    overview,
    items: [...collected.values()].sort((a, b) => a.priority - b.priority || a.question_id.localeCompare(b.question_id)),
    // Which gaps it never got to. Surfaced rather than hidden: a plan that
    // silently covers nine of eleven gaps is worse than one that says so.
    unaddressed: [...workList.keys()].filter((id) => !collected.has(id)),
    transcript,
    iterations,
    usage,
    stopReason,
    model,
    promptVersion: PROMPT_VERSION,
  };
}

/**
 * One model turn.
 *
 * Streamed, because a turn that reads several requirements and writes a long
 * item can run past a plain request timeout, and `finalMessage()` gives the
 * assembled result back either way.
 *
 * Refusal fallbacks are asked for, so a declined request is retried server-side
 * on another model inside the same call rather than failing the run. They are
 * behind a beta flag, and a deployment running an SDK or an account that does
 * not have it would otherwise see every run fail on a 400 about a parameter it
 * never asked for — so a rejection that names the parameter drops it and retries
 * once, and the run proceeds without the safety net rather than not at all.
 */
let fallbacksUnsupported = false;

async function createMessage(anthropic, { model, messages }) {
  const request = {
    model,
    max_tokens: MAX_TOKENS,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    // The tool list is stable and sits in front of the conversation, so the
    // brief above is read from cache on every turn after the first.
    tools: TOOL_DEFINITIONS,
    thinking: { type: 'adaptive', display: 'summarized' },
    output_config: { effort: 'high' },
    messages,
  };

  if (!fallbacksUnsupported) {
    try {
      const stream = anthropic.beta.messages.stream({
        ...request,
        betas: [FALLBACK_BETA],
        fallbacks: [{ model: FALLBACK_MODEL }],
      });
      return await stream.finalMessage();
    } catch (err) {
      if (!isUnsupportedParameterError(err)) throw err;
      fallbacksUnsupported = true;
      console.warn(
        'This account or SDK does not accept refusal fallbacks, so remediation runs will proceed without them. ' +
          `A declined request will fail the run instead of retrying on ${FALLBACK_MODEL}.`
      );
    }
  }

  const stream = anthropic.messages.stream(request);
  return await stream.finalMessage();
}

/** A 400 about the fallback parameter or its beta flag, rather than about the
 *  request's own content. */
function isUnsupportedParameterError(err) {
  if (err?.status !== 400) return false;
  return /fallback|beta/i.test(err?.message || '');
}
