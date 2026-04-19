export interface PayrollBatch {
  id: string;
  fileName: string;
  uploadedAt: string;
  batchStatus: 'Pending' | 'Approved';
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
}

export interface SummaryRow {
  workerId: string;
  workerName: string;
  site: string;
  daysPresent: number;
  basePay: number;
  siteAllowance: number;
  grossPay: number;
  netPay: number;
  status: 'Ready' | 'Disputed';
  batchId: string;
  batchStatus: 'Pending' | 'Approved';
}

export interface AuditLog {
  id: string;
  eventType: 'CalculationRun' | 'BatchApproved';
  batchId: string | null;
  actor: string;
  detail: string;
  occurredAt: string;
}

export interface UploadResponse {
  batchId: string;
  fileName: string;
  recordCount: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface BatchCounts {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface SiteCalculations {
  ready: number;
  disputed: number;
  flagged: number;
}

export interface SiteSummary {
  site: string;
  batchCount: number;
  employeeCount: number;
  calculations: SiteCalculations;
}

export interface RecentBatch {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  recordCount: number;
  approvedBy: string | null;
  approvedAt: string | null;
}

export interface DashboardSummary {
  batchCounts: BatchCounts;
  siteSummaries: SiteSummary[];
  recentBatches: RecentBatch[];
}

// ─── Payroll Calculation ──────────────────────────────────────────────────────

export interface PayrollCalculation {
  id: string;
  payrollRecordId: string;
  batchId: string;
  basePay: number;
  siteAllowance: number;
  grossPay: number;
  netPay: number;
  status: 'Ready' | 'Disputed';
  createdAt: string;
  createdBy: string;
}
