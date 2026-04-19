import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  dashboard: icon('ic-dashboard'),
  analytics: icon('ic-analytics'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: 'SiteForce',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.siteforce.root,
        icon: ICONS.dashboard,
      },
      {
        title: 'PayFlow Engine',
        path: paths.dashboard.payflow.root,
        icon: ICONS.analytics,
      },
    ],
  },
];
