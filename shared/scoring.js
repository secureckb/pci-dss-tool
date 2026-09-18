import { getSections } from './questions/index.js';

/**
 * The five responses a client may give to a SAQ question.
 *
 * PCI DSS validation is strictly pass/fail: a single "no" makes the whole
 * questionnaire non-compliant. "yes-ccw" and "yes-customized" do not fail the
 * assessment, but they cannot be self-validated either — they require a QSA
 * to review the compensating control worksheet or the customized approach
 * documentation, so they hold the result at "pending review".
 */
export const RESPONSES = {
  yes: {
    key: 'yes',
    label: 'Yes',
    short: 'Yes',
    hint: 'The requirement is fully in place using the defined approach.',
    passes: true,
    needsReview: false,
    requiresText: false,
  },
  'yes-ccw': {
    key: 'yes-ccw',
    label: 'Yes with Compensating Control',
    short: 'Yes (CCW)',
    hint: 'The requirement is met by a compensating control. A Compensating Control Worksheet (Appendix C) is required and must be validated by an assessor.',
    passes: true,
    needsReview: true,
    requiresText: true,
    textLabel: 'Describe the compensating control and the Appendix C worksheet reference',
  },
  'yes-customized': {
    key: 'yes-customized',
    label: 'Yes with Customized Approach',
    short: 'Yes (Customized)',
    hint: 'The requirement is met using the customized approach. Requires a targeted risk analysis (Req 12.3.2), a controls matrix, and assessor validation. Not permitted for requirements that have no stated customized approach objective.',
    passes: true,
    needsReview: true,
    requiresText: true,
    textLabel: 'Describe the customized approach and reference the controls matrix / targeted risk analysis',
  },
  no: {
    key: 'no',
    label: 'No',
    short: 'No',
    hint: 'The requirement is not in place, or is only partially in place. This fails the assessment and must appear on a remediation plan.',
    passes: false,
    needsReview: false,
    requiresText: false,
    textLabel: 'Describe the gap and your planned remediation (optional but recommended)',
  },
  na: {
    key: 'na',
    label: 'Not Applicable',
    short: 'N/A',
    hint: 'The requirement does not apply to your environment. A written justification is mandatory and will be reviewed.',
    passes: true,
    needsReview: false,
    requiresText: true,
    textLabel: 'Justification for why this requirement does not apply',
  },
};

export const RESPONSE_KEYS = Object.keys(RESPONSES);

/** Overall determinations the tool can return. */
export const DETERMINATIONS = {
  incomplete: {
    key: 'incomplete',
    label: 'Incomplete',
    headline: 'Assessment not finished',
    summary:
      'Not every applicable requirement has been answered. A determination cannot be made until the questionnaire is complete.',
  },
  'non-compliant': {
    key: 'non-compliant',
    label: 'Non-Compliant',
    headline: 'Does not pass the self-assessment',
    summary:
      'One or more requirements were answered "No". Under PCI DSS v4.0.1 every applicable requirement must be in place, so the assessment fails until each gap is remediated.',
  },
  'pending-review': {
    key: 'pending-review',
    label: 'Compliant — Pending Assessor Review',
    headline: 'Passes, subject to assessor validation',
    summary:
      'No requirement was answered "No", but one or more requirements rely on a compensating control or the customized approach. These cannot be self-validated — an assessor must review the supporting worksheets before compliance is confirmed.',
  },
  compliant: {
    key: 'compliant',
    label: 'Compliant',
    headline: 'Passes the self-assessment',
    summary:
      'Every applicable requirement is in place, or is documented as not applicable with a written justification. The questionnaire supports a compliant attestation.',
  },
};

/**
 * Answers that require a written justification but do not have one are treated
 * as unresolved: they neither pass nor fail outright, but they block a clean
 * determination because the SAQ is not properly completed without the text.
 */
function isMissingJustification(question, answer) {
  const response = RESPONSES[answer.response];
  if (!response || !response.requiresText) return false;
  return !answer.justification || answer.justification.trim().length === 0;
}

/**
 * Score an assessment.
 *
 * @param {string} variant 'merchant' | 'service-provider'
 * @param {Record<string, {response: string, justification?: string, evidence?: string}>} answers
 * @returns a full result object: overall determination, per-section rollups, and the gap list.
 */
export function scoreAssessment(variant, answers = {}) {
  const sections = getSections(variant);

  const gaps = [];
  const reviewItems = [];
  const naItems = [];
  const unanswered = [];
  const missingJustification = [];

  const sectionResults = sections.map((section) => {
    const counts = { yes: 0, 'yes-ccw': 0, 'yes-customized': 0, no: 0, na: 0, unanswered: 0 };
    // An answer whose mandatory justification is blank leaves the section
    // unfinished, exactly as an unanswered question does. Counting it here keeps
    // a section from reading "Pass" while the assessment reads "Incomplete".
    let sectionMissingJustification = 0;

    section.questions.forEach((question) => {
      const answer = answers[question.id];
      const entry = {
        id: question.id,
        title: question.title,
        question: question.question,
        requirement: question.requirement,
        sectionId: section.id,
        sectionTitle: section.title,
        justification: answer?.justification || '',
        evidence: answer?.evidence || '',
      };

      if (!answer || !answer.response || !RESPONSES[answer.response]) {
        counts.unanswered += 1;
        unanswered.push(entry);
        return;
      }

      counts[answer.response] += 1;

      if (answer.response === 'no') {
        gaps.push(entry);
      } else if (answer.response === 'na') {
        naItems.push(entry);
      } else if (RESPONSES[answer.response].needsReview) {
        reviewItems.push({ ...entry, response: answer.response });
      }

      if (isMissingJustification(question, answer)) {
        sectionMissingJustification += 1;
        missingJustification.push({ ...entry, response: answer.response });
      }
    });

    const total = section.questions.length;
    const answered = total - counts.unanswered;
    return {
      id: section.id,
      title: section.title,
      goal: section.goal,
      total,
      answered,
      counts,
      missingJustification: sectionMissingJustification,
      // A section passes only when nothing in it was answered "No", nothing is
      // left blank, and every answer that owes a justification has one.
      status:
        counts.unanswered > 0 || sectionMissingJustification > 0
          ? 'incomplete'
          : counts.no > 0
            ? 'fail'
            : counts['yes-ccw'] + counts['yes-customized'] > 0
              ? 'review'
              : 'pass',
    };
  });

  const totals = sectionResults.reduce(
    (acc, s) => {
      acc.total += s.total;
      acc.answered += s.answered;
      Object.keys(s.counts).forEach((k) => {
        acc.counts[k] += s.counts[k];
      });
      return acc;
    },
    { total: 0, answered: 0, counts: { yes: 0, 'yes-ccw': 0, 'yes-customized': 0, no: 0, na: 0, unanswered: 0 } }
  );

  let determination;
  if (totals.counts.unanswered > 0 || missingJustification.length > 0) {
    determination = 'incomplete';
  } else if (totals.counts.no > 0) {
    determination = 'non-compliant';
  } else if (totals.counts['yes-ccw'] + totals.counts['yes-customized'] > 0) {
    determination = 'pending-review';
  } else {
    determination = 'compliant';
  }

  return {
    variant,
    determination,
    determinationDetail: DETERMINATIONS[determination],
    passed: determination === 'compliant' || determination === 'pending-review',
    totals,
    // Progress is completion, not a compliance score. PCI DSS has no partial credit.
    completionPercent: totals.total === 0 ? 0 : Math.round((totals.answered / totals.total) * 100),
    sections: sectionResults,
    gaps,
    reviewItems,
    naItems,
    unanswered,
    missingJustification,
    scoredAt: new Date().toISOString(),
  };
}
