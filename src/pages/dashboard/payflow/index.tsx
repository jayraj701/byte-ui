import { CONFIG } from 'src/global-config';

import { PayflowEngineView } from 'src/sections/siteforce/view';

// ----------------------------------------------------------------------

const metadata = { title: `PayFlow Engine | SiteForce - ${CONFIG.appName}` };

export default function PayflowEnginePage() {
  return (
    <>
      <title>{metadata.title}</title>
      <PayflowEngineView />
    </>
  );
}
