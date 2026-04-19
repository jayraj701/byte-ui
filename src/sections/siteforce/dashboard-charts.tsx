import type { BatchCounts, SiteSummary } from 'src/api/types';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = {
  batchCounts?: BatchCounts;
  siteSummaries?: SiteSummary[];
  loading: boolean;
};

export function DashboardCharts({ batchCounts, siteSummaries, loading }: Props) {
  const theme = useTheme();

  const donutOptions = useChart({
    labels: ['Pending', 'Approved', 'Rejected'],
    colors: [
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.error.main,
    ],
    legend: { show: true, position: 'bottom', horizontalAlign: 'center' },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: { label: 'Total', show: true },
          },
        },
      },
    },
    tooltip: { fillSeriesColor: false },
  });

  const barOptions = useChart({
    colors: [
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    chart: { stacked: true },
    legend: { show: true, position: 'top', horizontalAlign: 'left' },
    xaxis: {
      categories: siteSummaries?.map((s) => s.site) ?? [],
    },
    yaxis: { tickAmount: 4 },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
    tooltip: { shared: true, intersect: false },
  });

  const barSeries = [
    { name: 'Ready', data: siteSummaries?.map((s) => s.calculations.ready) ?? [] },
    { name: 'Disputed', data: siteSummaries?.map((s) => s.calculations.disputed) ?? [] },
    { name: 'Flagged', data: siteSummaries?.map((s) => s.calculations.flagged) ?? [] },
  ];

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Donut — batch status */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Batch Status
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Distribution of all batches by approval status.
          </Typography>
          <Chart
            type="donut"
            series={[
              batchCounts?.pending ?? 0,
              batchCounts?.approved ?? 0,
              batchCounts?.rejected ?? 0,
            ]}
            options={donutOptions}
            sx={{ height: 260 }}
          />
        </Card>
      </Grid>

      {/* Bar — per-site breakdown */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Site Calculation Breakdown
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Ready / Disputed / Flagged records per site.
          </Typography>
          <Chart
            type="bar"
            series={barSeries}
            options={barOptions}
            sx={{ height: 260 }}
          />
        </Card>
      </Grid>
    </Grid>
  );
}
