import { asyncRouter } from '../async-router.js';
import { ALL_SECTIONS, VARIANTS, getQuestions } from '../../shared/questions/index.js';
import { RESPONSES, DETERMINATIONS } from '../../shared/scoring.js';

const router = asyncRouter();

/**
 * The published reference for everything in the question bank.
 *
 * Public and read-only: it exposes no client data, only the requirements the
 * tool assesses and the rules it applies to them. Sections carry every
 * question with `appliesTo` intact, so the page can show which requirements
 * are service-provider-only rather than serving a per-variant subset.
 */
router.get('/', (req, res) => {
  // The catalogue only changes when the bank is edited and a new build ships,
  // so let browsers and any proxy hold it for an hour.
  res.set('Cache-Control', 'public, max-age=3600');

  const variants = Object.fromEntries(
    Object.entries(VARIANTS).map(([key, variant]) => [key, { ...variant, count: getQuestions(key).length }])
  );

  res.json({
    standard: 'PCI DSS',
    version: '4.0.1',
    questionnaire: 'SAQ D',
    variants,
    responses: RESPONSES,
    determinations: DETERMINATIONS,
    sections: ALL_SECTIONS,
    totals: {
      sections: ALL_SECTIONS.length,
      questions: ALL_SECTIONS.reduce((sum, s) => sum + s.questions.length, 0),
      serviceProviderOnly: ALL_SECTIONS.reduce(
        (sum, s) => sum + s.questions.filter((q) => q.appliesTo === 'service-provider').length,
        0
      ),
      naPermitted: ALL_SECTIONS.reduce((sum, s) => sum + s.questions.filter((q) => q.allowNA).length, 0),
    },
  });
});

export default router;
