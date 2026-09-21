/**
 * Invariants over the question bank and the eligibility tree.
 *
 * These are the properties a reader has to be able to trust without counting by
 * hand: that the bank really holds the number of requirements the tool claims,
 * that no requirement is duplicated or unreachable, and that every SAQ the
 * wizard can name is one it can actually reach. Run as part of `npm run build`,
 * so a bad edit fails the build rather than reaching a client.
 */
import { ALL_SECTIONS, getQuestions, getSections } from '../shared/questions/index.js';
import { ELIGIBILITY_STEPS, FIRST_STEP, SAQ_TYPES, determineSaq } from '../shared/eligibility.js';
import { RESPONSES } from '../shared/scoring.js';

const EXPECTED = { merchant: 235, 'service-provider': 260 };

const failures = [];
const check = (label, condition, detail = '') => {
  if (!condition) failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
};

// --- question bank ---
const all = ALL_SECTIONS.flatMap((s) => s.questions);

for (const [variant, expected] of Object.entries(EXPECTED)) {
  const actual = getQuestions(variant).length;
  check(`${variant} edition has ${expected} requirements`, actual === expected, `found ${actual}`);
}

const ids = all.map((q) => q.id);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
check('no requirement id appears twice', duplicates.length === 0, duplicates.join(', '));

check(
  'merchant and service-provider editions differ only by service-provider-only requirements',
  getQuestions('service-provider').length - getQuestions('merchant').length ===
    all.filter((q) => q.appliesTo === 'service-provider').length
);

for (const q of all) {
  check(`${q.id} has a question, requirement text and title`, Boolean(q.question && q.requirement && q.title));
  check(`${q.id} has a valid appliesTo`, ['all', 'service-provider', 'merchant'].includes(q.appliesTo), q.appliesTo);
  check(`${q.id} declares allowNA`, typeof q.allowNA === 'boolean');
  // An N/A-eligible requirement without a condition leaves the client guessing
  // when the exclusion is legitimate, which is how the appendix bug happened.
  check(`${q.id} explains when N/A applies`, !q.allowNA || Boolean(q.condition));
  check(`${q.id} has no condition text unless N/A is permitted`, q.allowNA || !q.condition);
}

for (const variant of Object.keys(EXPECTED)) {
  const sections = getSections(variant);
  check(`${variant} sections are all non-empty`, sections.every((s) => s.questions.length > 0));
}

// --- eligibility tree ---
check('the first step exists', Boolean(ELIGIBILITY_STEPS[FIRST_STEP]));

const reachableSteps = new Set();
const reachableOutcomes = new Set();
const walk = (stepId, seen = new Set()) => {
  if (seen.has(stepId)) {
    failures.push(`eligibility tree loops at ${stepId}`);
    return;
  }
  const step = ELIGIBILITY_STEPS[stepId];
  if (!step) {
    failures.push(`eligibility step ${stepId} is referenced but not defined`);
    return;
  }
  reachableSteps.add(stepId);
  for (const option of step.options) {
    if (option.outcome) reachableOutcomes.add(option.outcome);
    else if (option.next) walk(option.next, new Set([...seen, stepId]));
    else failures.push(`${stepId} option "${option.value}" leads nowhere`);
  }
};
walk(FIRST_STEP);

for (const stepId of Object.keys(ELIGIBILITY_STEPS)) {
  check(`eligibility step ${stepId} is reachable`, reachableSteps.has(stepId));
}
for (const key of Object.keys(SAQ_TYPES)) {
  check(`${key} is reachable from the eligibility tree`, reachableOutcomes.has(key));
}
for (const outcome of reachableOutcomes) {
  check(`outcome ${outcome} is a defined SAQ type`, Boolean(SAQ_TYPES[outcome]));
}

// The two SAQs this tool administers must map to real question banks.
for (const type of Object.values(SAQ_TYPES)) {
  if (!type.variant) continue;
  check(`${type.key} maps to a known variant`, Object.keys(EXPECTED).includes(type.variant), type.variant);
}

// An empty answer set must ask, never settle.
const opening = determineSaq({});
check('an unanswered wizard asks the first question', !opening.complete && opening.nextStep.id === FIRST_STEP);

// --- scoring ---
check('exactly one response fails an assessment', Object.values(RESPONSES).filter((r) => !r.passes).length === 1);
for (const r of Object.values(RESPONSES)) {
  check(`response "${r.key}" that needs text says what text`, !r.requiresText || Boolean(r.textLabel));
}

if (failures.length > 0) {
  console.error(`\nQuestion bank verification failed (${failures.length}):\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `Question bank verified: ${EXPECTED.merchant} merchant / ${EXPECTED['service-provider']} service-provider ` +
    `requirements, ${Object.keys(ELIGIBILITY_STEPS).length} eligibility steps, ` +
    `${Object.keys(SAQ_TYPES).length} SAQ outcomes, all reachable.`
);
