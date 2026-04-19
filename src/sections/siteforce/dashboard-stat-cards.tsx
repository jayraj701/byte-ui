import type { BatchCounts } from 'src/api/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import type { IconifyName } from 'src/components/iconify/register-icons';

// ----------------------------------------------------------------------

type Props = {
  counts?: BatchCounts;
  loading: boolean;
};

type StatItem = {
  label: string;
  value: number;
  icon: IconifyName;
  color: string;
  bg: string;
};

export function DashboardStatCards({ counts, loading }: Props) {
  const theme = useTheme();

  const stats: StatItem[] = [
    {
      label: 'Total Batches',
      value: counts?.total ?? 0,
      icon: 'solar:bill-list-bold',
      color: theme.palette.primary.main,
      bg: theme.palette.primary.lighter ?? theme.palette.primary.light,
    },
    {
      label: 'Pending',
      value: counts?.pending ?? 0,
      icon: 'solar:clock-circle-bold',
      color: theme.palette.warning.main,
      bg: theme.palette.warning.lighter ?? theme.palette.warning.light,
    },
    {
      label: 'Approved',
      value: counts?.approved ?? 0,
      icon: 'solar:check-circle-bold',
      color: theme.palette.success.main,
      bg: theme.palette.success.lighter ?? theme.palette.success.light,
    },
    {
      label: 'Rejected',
      value: counts?.rejected ?? 0,
      icon: 'solar:close-circle-bold',
      color: theme.palette.error.main,
      bg: theme.palette.error.lighter ?? theme.palette.error.light,
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" height={120} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {stats.map((stat) => (
        <Card key={stat.label} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {stat.label}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon={stat.icon} width={28} sx={{ color: stat.color }} />
            </Box>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
