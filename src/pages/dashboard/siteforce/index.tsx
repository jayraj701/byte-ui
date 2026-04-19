import { CONFIG } from 'src/global-config';
import { SiteforceDashboardView } from 'src/sections/siteforce/view';

// ----------------------------------------------------------------------

const metadata = { title: `Payroll | SiteForce - ${CONFIG.appName}` };

export default function SiteforcePage() {
  return (
    <>
      <title>{metadata.title}</title>
      <SiteforceDashboardView />
    </>
  );
}
