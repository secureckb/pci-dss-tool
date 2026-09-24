export type ResponseKey = 'yes' | 'yes-ccw' | 'no' | 'na';
export type Determination = 'incomplete' | 'non-compliant' | 'pending-review' | 'compliant';
export type Variant = 'merchant' | 'service-provider';

export interface Question {
  id: string;
  title: string;
  question: string;
  requirement: string;
  testing: string[];
  guidance?: string;
  condition?: string;
  appliesTo: 'all' | 'service-provider' | 'merchant';
  allowNA: boolean;
}

export interface Section {
  id: number | string;
  title: string;
  goal: string;
  intro: string;
  questions: Question[];
}

export interface Answer {
  response: ResponseKey;
  justification: string;
  evidence: string;
  updatedAt?: string;
}

export type AnswerMap = Record<string, Answer>;

export interface SectionResult {
  id: number | string;
  title: string;
  goal: string;
  total: number;
  answered: number;
  counts: Record<ResponseKey | 'unanswered', number>;
  missingJustification: number;
  status: 'pass' | 'fail' | 'review' | 'incomplete';
}

export interface GapEntry {
  id: string;
  title: string;
  question: string;
  requirement: string;
  sectionId: number | string;
  sectionTitle: string;
  justification: string;
  evidence: string;
  response?: ResponseKey;
}

export interface Result {
  variant: Variant;
  determination: Determination;
  determinationDetail: { key: string; label: string; headline: string; summary: string };
  passed: boolean;
  totals: { total: number; answered: number; counts: Record<ResponseKey | 'unanswered', number> };
  completionPercent: number;
  sections: SectionResult[];
  gaps: GapEntry[];
  reviewItems: GapEntry[];
  naItems: GapEntry[];
  unanswered: GapEntry[];
  missingJustification: GapEntry[];
  scoredAt: string;
}

export interface ClientAssessment {
  variant: Variant | null;
  variantLabel: string | null;
  saqType: string | null;
  saqName: string | null;
  eligibility: EligibilityRecord | null;
  eligibilityCompletedAt: string | null;
  clientName: string;
  contactName: string | null;
  dba: string | null;
  scopeSummary: string | null;
  status: 'in-progress' | 'submitted';
  submittedAt: string | null;
  submittedBy: string | null;
  submittedTitle: string | null;
}

export interface AdminAssessmentSummary {
  id: string;
  token: string;
  variant: Variant | null;
  variantLabel: string | null;
  saqType: string | null;
  saqName: string | null;
  administered: boolean;
  eligibilityCompletedAt: string | null;
  clientName: string;
  contactName: string | null;
  contactEmail: string | null;
  status: 'in-progress' | 'submitted';
  answered: number;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  link: string;
}

export interface AdminAssessmentDetail extends AdminAssessmentSummary {
  dba: string | null;
  scopeSummary: string | null;
  internalNotes: string | null;
  submittedBy: string | null;
  submittedTitle: string | null;
  saq: SaqType | null;
  eligibility: EligibilityRecord | null;
}

export type EligibilityAnswers = Record<string, string>;

export interface EligibilityOption {
  value: string;
  label: string;
  description: string;
  next?: string;
  outcome?: string;
  note?: string;
}

export interface EligibilityStep {
  id: string;
  question: string;
  help?: string;
  options: EligibilityOption[];
}

export interface SaqType {
  key: string;
  name: string;
  headline: string;
  summary: string;
  eligibility: string[];
  scope: string;
  variant: Variant | null;
}

export interface EligibilityPathEntry {
  stepId: string;
  question: string;
  value: string;
  label: string;
  description: string;
}

export interface EligibilityOutcome {
  complete: boolean;
  nextStep?: EligibilityStep;
  path: EligibilityPathEntry[];
  saqType?: string;
  saq?: SaqType;
  variant?: Variant | null;
  administered?: boolean;
  notes?: { stepId: string; note: string }[];
  determinedAt?: string;
}

export interface EligibilityRecord {
  answers: EligibilityAnswers;
  saqType: string;
  path: EligibilityPathEntry[];
  notes: { stepId: string; note: string }[];
  determinedAt: string;
}

/**
 * The remediation advisor.
 *
 * Its output is kept in its own types rather than folded into Result, because it
 * is a different kind of thing: Result is computed from the client's answers by
 * fixed rules, and a plan is advice a model drafted about that result. Nothing
 * here feeds back into Result.
 */
export interface RemediationItem {
  questionId: string;
  priority: number;
  summary: string;
  steps: string;
  evidence: string;
  effort: string;
  ownerRole: string;
  related: string;
}

export interface RemediationPlan {
  id: string;
  status: 'draft' | 'approved' | 'discarded';
  determination: Determination;
  gapCount: number;
  overview: string;
  model: string;
  promptVersion: string;
  createdAt: string;
  reviewedAt: string | null;
  /** The assessment has changed since this plan was drafted. */
  stale: boolean;
  items: RemediationItem[];
}

export interface AgentRun {
  id: string;
  planId: string | null;
  status: 'running' | 'succeeded' | 'failed';
  model: string;
  iterations: number;
  inputTokens: number;
  outputTokens: number;
  stopReason: string | null;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface RemediationState {
  /** False when the deployment has no model access. Everything else still works. */
  configured: boolean;
  model: string;
  gapCount: number;
  running: { id: string; startedAt: string } | null;
  plan: RemediationPlan | null;
  approvedPlanId: string | null;
  runs: AgentRun[];
}
