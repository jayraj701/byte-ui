import type { UploadResponse, PayrollBatch, SummaryRow, AuditLog, PayrollCalculation, DashboardSummary } from './types';

import axiosInstance from 'src/lib/axios';

export const attendanceApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post<UploadResponse>('/api/attendance/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  calculate: (batchId: string) =>
    axiosInstance.post<PayrollCalculation[]>(`/api/attendance/${batchId}/calculate`),
};

export const payrollApi = {
  getBatches: () => axiosInstance.get<PayrollBatch[]>('/api/payroll/batches'),

  getSummary: (batchId?: string) =>
    axiosInstance.get<SummaryRow[]>('/api/payroll/summary', {
      params: batchId ? { batchId } : undefined,
    }),

  approveBatch: (batchId: string) =>
    axiosInstance.post<PayrollBatch>(`/api/payroll/batches/${batchId}/approve`),
};

export const auditApi = {
  getLogs: (batchId?: string) =>
    axiosInstance.get<AuditLog[]>('/api/audit', {
      params: batchId ? { batchId } : undefined,
    }),
};

export const dashboardApi = {
  getSummary: () => axiosInstance.get<DashboardSummary>('/api/dashboard'),
};
