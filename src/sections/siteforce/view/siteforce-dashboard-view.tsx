import { useState } from 'react';
import { useSearchParams } from 'react-router';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { useBatches } from 'src/api/hooks';

import { BatchList } from '../batch-list';
import { SummaryTable } from '../summary-table';
import { AuditLogPanel } from '../audit-log-panel';
import { UploadDialog } from '../upload-dialog';

// ----------------------------------------------------------------------

export function SiteforceDashboardView() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const activeBatchId = searchParams.get('batchId') ?? undefined;

  const { data: batches } = useBatches();
  const activeBatch = batches?.find((b) => b.id === activeBatchId);

  return (
    <>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">Smart Payment Disbursement</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Upload attendance, calculate payroll, and approve disbursements.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Left — batch list */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper variant="outlined" sx={{ height: '100%', minHeight: 500, overflow: 'hidden' }}>
            <BatchList onUploadClick={() => setUploadOpen(true)} />
          </Paper>
        </Grid>

        {/* Right — summary + audit */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              {activeBatch && (
                <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {activeBatch.fileName}
                  </Typography>
                </Stack>
              )}
              <Divider sx={{ mb: 2, display: activeBatch ? 'block' : 'none' }} />
              <SummaryTable batchId={activeBatchId} batchStatus={activeBatch?.batchStatus} />
            </Paper>

            <AuditLogPanel batchId={activeBatchId} />
          </Stack>
        </Grid>
      </Grid>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
