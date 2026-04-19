import type { RecentBatch } from 'src/api/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate, fToNow } from 'src/utils/format-time';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  batches?: RecentBatch[];
  loading: boolean;
  onBatchClick: (batchId: string) => void;
};

const STATUS_COLOR: Record<string, 'warning' | 'success' | 'error'> = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
};

export function DashboardRecentBatches({ batches, loading, onBatchClick }: Props) {
  return (
    <Card>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2.5 }}>
        <Box>
          <Typography variant="subtitle1">Recent Uploads</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Last {batches?.length ?? 0} batches processed
          </Typography>
        </Box>
        <Link
          component={RouterLink}
          href={paths.dashboard.payflow.root}
          variant="body2"
          sx={{ fontWeight: 600 }}
        >
          View All →
        </Link>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Records</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Approved By</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : batches?.map((batch) => (
                  <TableRow
                    key={batch.id}
                    hover
                    onClick={() => onBatchClick(batch.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 240 }}>
                        {batch.fileName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Label color={STATUS_COLOR[batch.status] ?? 'default'} variant="soft">
                        {batch.status}
                      </Label>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="body2">{batch.recordCount.toLocaleString()}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{fDate(batch.uploadedAt)}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {fToNow(batch.uploadedAt)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: batch.approvedBy ? 'text.primary' : 'text.disabled' }}>
                        {batch.approvedBy ?? '—'}
                      </Typography>
                      {batch.approvedAt && (
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                          {fDate(batch.approvedAt)}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
