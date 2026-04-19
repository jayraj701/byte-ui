import type { GridColDef } from '@mui/x-data-grid';
import type { SummaryRow } from 'src/api/types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { EmptyContent } from 'src/components/empty-content';

import { useSummary } from 'src/api/hooks';

import { ApproveBatchButton } from './approve-batch-button';

// ----------------------------------------------------------------------

type Props = {
  batchId?: string;
  batchStatus?: 'Pending' | 'Approved';
};

const columns: GridColDef<SummaryRow>[] = [
  { field: 'workerId', headerName: 'Worker ID', width: 100 },
  { field: 'workerName', headerName: 'Name', flex: 1, minWidth: 140 },
  { field: 'site', headerName: 'Site', width: 90 },
  { field: 'daysPresent', headerName: 'Days', width: 70, type: 'number' },
  {
    field: 'basePay',
    headerName: 'Base Pay',
    width: 110,
    type: 'number',
    valueFormatter: (value: number) => fCurrency(value),
  },
  {
    field: 'siteAllowance',
    headerName: 'Allowance',
    width: 110,
    type: 'number',
    valueFormatter: (value: number) => fCurrency(value),
  },
  {
    field: 'grossPay',
    headerName: 'Gross Pay',
    width: 110,
    type: 'number',
    valueFormatter: (value: number) => fCurrency(value),
  },
  {
    field: 'deduction',
    headerName: 'Deduction',
    width: 110,
    type: 'number',
    valueGetter: (_value: unknown, row: SummaryRow) => row.grossPay - row.netPay,
    valueFormatter: (value: number) => fCurrency(value),
  },
  {
    field: 'netPay',
    headerName: 'Net Pay',
    width: 110,
    type: 'number',
    valueFormatter: (value: number) => fCurrency(value),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    renderCell: ({ value }) => (
      <Label color={value === 'Ready' ? 'success' : 'error'} variant="soft">
        {value}
      </Label>
    ),
  },
];

export function SummaryTable({ batchId, batchStatus }: Props) {
  const { data: rows, isLoading } = useSummary(batchId);

  if (!batchId) {
    return (
      <EmptyContent
        title="Select a batch"
        description="Choose a batch from the left panel or upload attendance to get started."
        sx={{ height: 400 }}
      />
    );
  }

  const disputedCount = rows?.filter((r) => r.status === 'Disputed').length ?? 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {rows ? `Showing ${rows.length} workers · ${disputedCount} disputed` : ''}
        </Typography>
        {batchId && batchStatus && (
          <ApproveBatchButton
            batchId={batchId}
            batchStatus={batchStatus}
            disputedCount={disputedCount}
          />
        )}
      </Stack>

      <DataGrid
        rows={rows ?? []}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.workerId}
        disableRowSelectionOnClick
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: 'background.neutral' } }}
      />
    </Box>
  );
}
