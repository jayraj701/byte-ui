import { useState } from 'react';

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'sonner';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useApproveBatch } from 'src/api/hooks';

// ----------------------------------------------------------------------

type Props = {
  batchId: string;
  batchStatus: 'Pending' | 'Approved';
  disputedCount: number;
};

export function ApproveBatchButton({ batchId, batchStatus, disputedCount }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useApproveBatch(batchId);

  if (batchStatus !== 'Pending') return null;

  const handleApprove = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success('Batch approved successfully');
        setOpen(false);
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="solar:check-circle-bold" />}
        onClick={() => setOpen(true)}
      >
        Approve Batch{disputedCount > 0 ? ` (${disputedCount} disputed)` : ''}
      </Button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Approve Batch"
        content={
          disputedCount > 0
            ? `This batch has ${disputedCount} disputed record(s). Are you sure you want to approve?`
            : 'Are you sure you want to approve this batch?'
        }
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            loading={isPending}
            onClick={handleApprove}
          >
            Approve
          </LoadingButton>
        }
      />
    </>
  );
}
