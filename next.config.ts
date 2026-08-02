import type { NextConfig } from "next";

import { PRODUCTION_URL, VERCEL_ALIAS } from "./src/lib/site";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Consolidate the duplicate host onto the canonical domain. Preview
      // deployments keep their own URLs — only this one exact host is moved.
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_ALIAS }],
        destination: `${PRODUCTION_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
