import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  user: icon('ic-user'),
  lock: icon('ic-lock'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: 'SiteForce',
    items: [
      {
        title: 'Payroll Dashboard',
        path: paths.dashboard.siteforce.root,
        icon: ICONS.dashboard,
      },
    ],
  },
  {
    subheader: 'Settings',
    items: [
      {
        title: 'Account',
        path: paths.dashboard.user.account,
        icon: ICONS.user,
        deepMatch: true,
      },
      {
        title: 'Permission',
        path: paths.dashboard.permission,
        icon: ICONS.lock,
        allowedRoles: ['admin', 'manager'],
      },
    ],
  },
];
