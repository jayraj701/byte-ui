import { useState, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { toast } from 'sonner';

import { Upload } from 'src/components/upload';

import { useUploadAndCalculate } from 'src/api/hooks';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onUploaded?: (batchId: string) => void;
};

export function UploadDialog({ open, onClose, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending, error, reset } = useUploadAndCalculate();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const handleClose = () => {
    setFile(null);
    reset();
    onClose();
  };

  const handleUpload = () => {
    if (!file) return;

    mutate(file, {
      onSuccess: ({ upload }) => {
        toast.success(`${upload.recordCount} records calculated for ${upload.fileName}`);
        onUploaded?.(upload.batchId);
        handleClose();
      },
      onError: () => {
        // error state displayed inline via the `error` from useMutation
      },
    });
  };

  const statusLabel = isPending ? 'Uploading & calculating…' : 'Submit';

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>Upload Attendance</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(error as Error).message}
          </Alert>
        )}

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Upload a .csv or .xlsx file. The system will calculate payroll automatically.
        </Typography>

        <Upload
          value={file}
          onDrop={handleDrop}
          accept={{ 'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }}
          loading={isPending}
          disabled={isPending}
          onDelete={() => setFile(null)}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={isPending}
          disabled={!file}
          onClick={handleUpload}
        >
          {statusLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
