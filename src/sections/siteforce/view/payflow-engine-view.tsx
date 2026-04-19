import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useBatches } from 'src/api/hooks';

import { BatchList } from '../batch-list';
import { SummaryTable } from '../summary-table';
import { AuditLogPanel } from '../audit-log-panel';
import { UploadDialog } from '../upload-dialog';

// ----------------------------------------------------------------------

export function PayflowEngineView() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialise from URL param so dashboard "View batch" links work
  const [activeBatchId, setActiveBatchId] = useState<string | undefined>(
    searchParams.get('batchId') ?? undefined
  );

  // Keep state in sync if URL param changes externally (e.g. browser back/forward)
  useEffect(() => {
    const id = searchParams.get('batchId') ?? undefined;
    setActiveBatchId(id);
  }, [searchParams]);

  const { data: batches } = useBatches();
  const activeBatch = batches?.find((b) => b.id === activeBatchId);

  const handleBatchSelect = (id: string) => {
    setActiveBatchId(id);
    setSearchParams({ batchId: id }, { replace: true });
  };

  return (
    <>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">PayFlow Engine</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Upload attendance, manage batches, and approve payroll disbursements.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper variant="outlined" sx={{ height: '100%', minHeight: 500, overflow: 'hidden' }}>
            <BatchList
              activeBatchId={activeBatchId}
              onBatchSelect={handleBatchSelect}
              onUploadClick={() => setUploadOpen(true)}
            />
          </Paper>
        </Grid>

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

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(batchId) => handleBatchSelect(batchId)}
      />
    </>
  );
}
