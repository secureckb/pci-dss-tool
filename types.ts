
export type ComplianceStatus = 'in-place' | 'not-in-place' | 'partially-in-place' | 'not-applicable' | 'not-started';

export interface SubRequirement {
  id: string;
  title: string;
  description: string;
  testingProcedures: string[];
  guidance?: string;
  customizedApproachObjective?: string;
}

export interface Requirement {
  id: number;
  title: string;
  description: string;
  subRequirements: SubRequirement[];
}

export interface AssessmentItem {
  requirementId: string;
  status: ComplianceStatus;
  evidence: string;
  notes: string;
  updatedAt: string;
}

export interface AssessmentState {
  items: Record<string, AssessmentItem>;
}
