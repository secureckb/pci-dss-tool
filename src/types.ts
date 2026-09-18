export type ResponseKey = 'yes' | 'yes-ccw' | 'yes-customized' | 'no' | 'na';
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
  variant: Variant;
  variantLabel: string;
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
  variant: Variant;
  variantLabel: string;
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
}
