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
