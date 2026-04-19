import type { PayrollBatch } from 'src/api/types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { useBatches } from 'src/api/hooks';

// ----------------------------------------------------------------------

type Props = {
  onUploadClick: () => void;
  activeBatchId?: string;
  onBatchSelect: (id: string) => void;
};

export function BatchList({ onUploadClick, activeBatchId, onBatchSelect }: Props) {
  const { data: batches, isLoading } = useBatches();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={onUploadClick}
        >
          Upload Attendance
        </Button>
      </Box>

      <Typography variant="overline" sx={{ px: 2, pb: 1, color: 'text.secondary' }}>
        Batches
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!isLoading && (!batches || batches.length === 0) && (
        <Typography variant="body2" sx={{ px: 2, color: 'text.disabled' }}>
          No batches yet. Upload attendance to get started.
        </Typography>
      )}

      <Stack spacing={0} sx={{ overflow: 'auto', flex: 1 }}>
        {batches
          ?.slice()
          .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
          .map((batch: PayrollBatch) => (
            <BatchRow
              key={batch.id}
              batch={batch}
              active={batch.id === activeBatchId}
              onSelect={() => onBatchSelect(batch.id)}
            />
          ))}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

type BatchRowProps = {
  batch: PayrollBatch;
  active: boolean;
  onSelect: () => void;
};

function BatchRow({ batch, active, onSelect }: BatchRowProps) {
  return (
    <Box
      onClick={onSelect}
      sx={{
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        borderLeft: active ? '3px solid' : '3px solid transparent',
        borderColor: active ? 'primary.main' : 'transparent',
        bgcolor: active ? 'action.selected' : 'transparent',
        '&:hover': { bgcolor: 'action.hover' },
        transition: 'all 0.15s',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={active ? 600 : 400}
            noWrap
            sx={{ maxWidth: 180 }}
          >
            {batch.fileName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDate(batch.uploadedAt)}
          </Typography>
        </Box>
        <Label
          color={batch.batchStatus === 'Approved' ? 'success' : 'warning'}
          variant="soft"
          sx={{ ml: 1, flexShrink: 0 }}
        >
          {batch.batchStatus}
        </Label>
      </Stack>
    </Box>
  );
}
