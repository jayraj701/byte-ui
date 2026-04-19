import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { attendanceApi, auditApi, payrollApi } from './client';

// ─── Query keys ──────────────────────────────────────────────────────────────

export const queryKeys = {
  batches: ['batches'] as const,
  summary: (batchId?: string) => ['summary', batchId] as const,
  audit: (batchId?: string) => ['audit', batchId] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useBatches() {
  return useQuery({
    queryKey: queryKeys.batches,
    queryFn: () => payrollApi.getBatches().then((r) => r.data),
  });
}

export function useSummary(batchId?: string) {
  return useQuery({
    queryKey: queryKeys.summary(batchId),
    queryFn: () => payrollApi.getSummary(batchId).then((r) => r.data),
    enabled: !!batchId,
  });
}

export function useAuditLogs(batchId?: string) {
  return useQuery({
    queryKey: queryKeys.audit(batchId),
    queryFn: () => auditApi.getLogs(batchId).then((r) => r.data),
    enabled: !!batchId,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useUploadAndCalculate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const { data: upload } = await attendanceApi.upload(file);
      const { data: calculations } = await attendanceApi.calculate(upload.batchId);
      return { upload, calculations };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.batches });
    },
  });
}

export function useApproveBatch(batchId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => payrollApi.approveBatch(batchId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.batches });
      qc.invalidateQueries({ queryKey: queryKeys.summary(batchId) });
      qc.invalidateQueries({ queryKey: queryKeys.audit(batchId) });
    },
  });
}
