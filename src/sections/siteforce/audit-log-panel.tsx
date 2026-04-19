import type { AuditLog } from 'src/api/types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useAuditLogs } from 'src/api/hooks';

// ----------------------------------------------------------------------

type Props = {
  batchId?: string;
};

export function AuditLogPanel({ batchId }: Props) {
  const [open, setOpen] = useState(true);
  const { data: logs, isLoading } = useAuditLogs(batchId);

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5, cursor: 'pointer' }}
        onClick={() => setOpen((v) => !v)}
      >
        <Typography variant="subtitle2">Audit Log</Typography>
        <IconButton size="small">
          <Iconify icon={open ? 'solar:double-alt-arrow-up-bold-duotone' : 'solar:double-alt-arrow-down-bold-duotone'} />
        </IconButton>
      </Stack>

      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 2 }}>
          {!batchId && (
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Select a batch to see audit events.
            </Typography>
          )}

          {batchId && isLoading && <CircularProgress size={20} />}

          {batchId && !isLoading && (!logs || logs.length === 0) && (
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              No audit events yet for this batch.
            </Typography>
          )}

          <Stack spacing={1}>
            {logs?.map((log: AuditLog) => (
              <AuditLogRow key={log.id} log={log} />
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

// ----------------------------------------------------------------------

function AuditLogRow({ log }: { log: AuditLog }) {
  const isCalculation = log.eventType === 'CalculationRun';

  return (
    <Stack direction="row" alignItems="flex-start" spacing={1.5}>
      <Chip
        size="small"
        label={isCalculation ? '⚡ Calculated' : '✓ Approved'}
        color={isCalculation ? 'info' : 'success'}
        variant="soft"
        sx={{ flexShrink: 0 }}
      />
      <Box>
        <Typography variant="body2">{log.detail}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {log.actor} · {fToNow(log.occurredAt)}
        </Typography>
      </Box>
    </Stack>
  );
}
