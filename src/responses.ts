import { RESPONSES as SHARED } from '../shared/scoring.js';
import type { ResponseKey } from './types';

interface ResponseMeta {
  key: ResponseKey;
  label: string;
  short: string;
  hint: string;
  passes: boolean;
  needsReview: boolean;
  requiresText: boolean;
  textLabel?: string;
  placeholder?: string;
}

const PLACEHOLDERS: Partial<Record<ResponseKey, string>> = {
  'yes-ccw':
    'Describe the compensating control, the constraint that prevents the stated requirement, and where the Appendix C worksheet is held.',
  na: 'Explain why this requirement does not apply — for example, "No wireless networks exist in any part of the environment."',
};

/** The shared scoring module is the single source of truth for response semantics. */
export const RESPONSES = Object.fromEntries(
  Object.entries(SHARED as Record<string, ResponseMeta>).map(([key, value]) => [
    key,
    { ...value, placeholder: PLACEHOLDERS[key as ResponseKey] },
  ])
) as Record<ResponseKey, ResponseMeta>;

/** Display order in the questionnaire: the two plain answers first, then the qualified ones. */
export const RESPONSE_ORDER: ResponseKey[] = ['yes', 'no', 'na', 'yes-ccw'];
