import { useNavigate } from 'react-router';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useDashboard } from 'src/api/hooks';

import { DashboardCharts } from '../dashboard-charts';
import { DashboardStatCards } from '../dashboard-stat-cards';
import { DashboardRecentBatches } from '../dashboard-recent-batches';

// ----------------------------------------------------------------------

export function SiteforceDashboardView() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();

  const handleBatchClick = (batchId: string) => {
    navigate(`${paths.dashboard.payflow.root}?batchId=${batchId}`);
  };

  return (
    <Stack spacing={3}>
      <Stack>
        <Typography variant="h4">Smart Payment Disbursement</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Overview of payroll batches, site performance, and recent activity.
        </Typography>
      </Stack>

      <DashboardStatCards counts={data?.batchCounts} loading={isLoading} />

      <DashboardCharts
        batchCounts={data?.batchCounts}
        siteSummaries={data?.siteSummaries}
        loading={isLoading}
      />

      <DashboardRecentBatches
        batches={data?.recentBatches}
        loading={isLoading}
        onBatchClick={handleBatchClick}
      />
    </Stack>
  );
}
