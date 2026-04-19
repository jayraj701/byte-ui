import { useState, useEffect, useCallback } from 'react';

import type { AuditLog, DashboardSummary, PayrollBatch, SummaryRow, UploadResponse, PayrollCalculation } from './types';
import { attendanceApi, auditApi, dashboardApi, payrollApi } from './client';

// ─── Cross-hook invalidation via browser custom events ────────────────────────

const emit = (key: string) => window.dispatchEvent(new Event(key));

const listen = (key: string, fn: () => void) => {
  window.addEventListener(key, fn);
  return () => window.removeEventListener(key, fn);
};

// ─── useDashboard ─────────────────────────────────────────────────────────────

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(() => {
    setIsLoading(true);
    dashboardApi
      .getSummary()
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => listen('sf:batches', fetch), [fetch]);

  return { data, isLoading };
}

// ─── useBatches ───────────────────────────────────────────────────────────────

export function useBatches() {
  const [data, setData] = useState<PayrollBatch[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(() => {
    setIsLoading(true);
    payrollApi
      .getBatches()
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => listen('sf:batches', fetch), [fetch]);

  return { data, isLoading };
}

// ─── useSummary ───────────────────────────────────────────────────────────────

export function useSummary(batchId?: string) {
  const [data, setData] = useState<SummaryRow[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    if (!batchId) { setData(undefined); return; }
    setIsLoading(true);
    setData(undefined);
    payrollApi
      .getSummary(batchId)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [batchId]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => listen('sf:summary', fetch), [fetch]);

  return { data, isLoading };
}

// ─── useAuditLogs ─────────────────────────────────────────────────────────────

export function useAuditLogs(batchId?: string) {
  const [data, setData] = useState<AuditLog[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    if (!batchId) { setData(undefined); return; }
    setIsLoading(true);
    setData(undefined);
    auditApi
      .getLogs(batchId)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [batchId]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => listen('sf:audit', fetch), [fetch]);

  return { data, isLoading };
}

// ─── useUploadAndCalculate ────────────────────────────────────────────────────

type UploadResult = { upload: UploadResponse; calculations: PayrollCalculation[] };
type UploadCallbacks = {
  onSuccess?: (result: UploadResult) => void;
  onError?: (e: Error) => void;
};

export function useUploadAndCalculate() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (file: File, callbacks?: UploadCallbacks) => {
    setIsPending(true);
    setError(null);
    try {
      const { data: upload } = await attendanceApi.upload(file);
      const { data: calculations } = await attendanceApi.calculate(upload.batchId);
      emit('sf:batches');
      callbacks?.onSuccess?.({ upload, calculations });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Upload failed');
      setError(err);
      callbacks?.onError?.(err);
    } finally {
      setIsPending(false);
    }
  }, []);

  const reset = useCallback(() => setError(null), []);

  return { mutate, isPending, error, reset };
}

// ─── useApproveBatch ──────────────────────────────────────────────────────────

type ApproveCallbacks = {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
};

export function useApproveBatch(batchId: string) {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (_variables: undefined, callbacks?: ApproveCallbacks) => {
    setIsPending(true);
    try {
      await payrollApi.approveBatch(batchId);
      emit('sf:batches');
      emit('sf:summary');
      emit('sf:audit');
      callbacks?.onSuccess?.();
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Approval failed');
      callbacks?.onError?.(err);
    } finally {
      setIsPending(false);
    }
  }, [batchId]);

  return { mutate, isPending };
}
