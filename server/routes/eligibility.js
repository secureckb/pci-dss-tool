import { asyncRouter } from '../async-router.js';
import { ELIGIBILITY_STEPS, FIRST_STEP, SAQ_TYPES, determineSaq } from '../../shared/eligibility.js';

const router = asyncRouter();

/**
 * The eligibility decision tree, for the public "which SAQ do I need?" wizard.
 *
 * Public and stateless: nothing is recorded and no client data is exposed. The
 * public wizard resolves the outcome in the browser from this same tree; inside
 * a client assessment the server recomputes it before storing, so a client can
 * never choose their own questionnaire by posting a result.
 */
router.get('/', (req, res) => {
  // Changes only when a new build ships, so it can be held for an hour.
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({
    standard: 'PCI DSS',
    version: '4.0.1',
    steps: ELIGIBILITY_STEPS,
    firstStep: FIRST_STEP,
    saqTypes: SAQ_TYPES,
  });
});

/** Resolve a set of eligibility answers without recording anything. */
router.post('/', (req, res) => {
  const answers = req.body?.answers;
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return res.status(400).json({ error: 'Eligibility answers are required.' });
  }

  let outcome;
  try {
    outcome = determineSaq(answers);
  } catch {
    return res.status(400).json({ error: 'Those eligibility answers could not be read.' });
  }

  if (!outcome.complete) {
    return res.status(400).json({
      error: 'The eligibility questions are not finished.',
      nextStep: outcome.nextStep.id,
    });
  }

  res.json({ saqType: outcome.saqType, saq: outcome.saq, path: outcome.path, notes: outcome.notes });
});

export default router;
