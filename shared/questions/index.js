import req01 from './req01.js';
import req02 from './req02.js';
import req03 from './req03.js';
import req04 from './req04.js';
import req05 from './req05.js';
import req06 from './req06.js';
import req07 from './req07.js';
import req08 from './req08.js';
import req09 from './req09.js';
import req10 from './req10.js';
import req11 from './req11.js';
import req12 from './req12.js';
import { appendixA1, appendixA2 } from './appendixA.js';

/**
 * Every section of the PCI DSS v4.0.1 SAQ D question bank, in order.
 * Sections A1/A2 are the Appendix A sections that apply only to certain entities.
 *
 * ---
 * How the wording in this bank works, and why.
 *
 * Requirement ids and section titles are PCI DSS v4.0.1's, kept exactly. They
 * are what makes a result usable: an acquirer, a QSA and the AOC all speak in
 * requirement numbers, so a finding that cannot cite 8.3.6 cannot be acted on.
 *
 * The prose is not the standard's. Every `question`, `requirement` and `testing`
 * string here is this project's own description of the requirement, written to
 * carry the same obligation in different words. The bank previously reproduced
 * around nineteen pages of the standard's text verbatim, which is the part its
 * licence actually covers, in a repository anyone could read.
 *
 * So, when editing this bank:
 *
 *   - Preserve every normative element exactly. Scope ("all", "any"), frequency
 *     ("no less often than every 12 months"), thresholds ("12 characters",
 *     "90 days", "no more than 10 attempts") and each enumerated condition must
 *     survive a rewording intact. Losing one makes the tool quietly wrong, which
 *     is worse than the problem the rewording solves.
 *   - Keep cross-references to other requirements as they are. "in the manner
 *     Requirement 12.3.1 lays down" is a pointer, not prose to be varied.
 *   - Terms of art stay: cardholder data, PAN, CDE, SAD, POI, multi-factor
 *     authentication. They are vocabulary, and substituting them loses meaning.
 *   - Do not paste text in from the standard, a QSA's report, or another tool's
 *     bank. Read the requirement, then say what it obliges in your own words.
 *
 * The catalogue page says all of this to the reader too, because a paraphrase
 * can be clearer than its source and can also be wrong where the source is not.
 * The standard governs wherever the two differ.
 */
export const ALL_SECTIONS = [
  req01,
  req02,
  req03,
  req04,
  req05,
  req06,
  req07,
  req08,
  req09,
  req10,
  req11,
  req12,
  appendixA1,
  appendixA2,
];

/** Assessment variants. SAQ D exists in a merchant and a service provider edition. */
export const VARIANTS = {
  merchant: {
    key: 'merchant',
    label: 'SAQ D for Merchants',
    description:
      'Merchants that store, process, or transmit cardholder data and are eligible to self-assess, but do not qualify for any other SAQ type.',
  },
  'service-provider': {
    key: 'service-provider',
    label: 'SAQ D for Service Providers',
    description:
      'Service providers that are eligible to self-assess. Includes the additional requirements that apply only to service providers.',
  },
};

/**
 * Returns the sections and questions that apply to a given variant.
 * Service-provider-only questions are dropped from the merchant edition, and
 * Appendix A1 (multi-tenant service providers) is dropped entirely for merchants.
 */
export function getSections(variant) {
  const isServiceProvider = variant === 'service-provider';
  return ALL_SECTIONS.map((section) => ({
    ...section,
    questions: section.questions.filter(
      (q) => q.appliesTo === 'all' || (isServiceProvider && q.appliesTo === 'service-provider')
    ),
  })).filter((section) => section.questions.length > 0);
}

/** Flat list of every applicable question for a variant, in document order. */
export function getQuestions(variant) {
  return getSections(variant).flatMap((section) =>
    section.questions.map((q) => ({ ...q, sectionId: section.id, sectionTitle: section.title }))
  );
}

/** Look up a single question by its requirement id, for a given variant. */
export function getQuestion(variant, questionId) {
  return getQuestions(variant).find((q) => q.id === questionId) || null;
}

export { VARIANTS as ASSESSMENT_VARIANTS };
