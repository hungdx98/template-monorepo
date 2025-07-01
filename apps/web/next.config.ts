/** @type {import('next').NextConfig} */

import type { NextConfig } from "next";


// const withNextIntl = require('next-intl/plugin')('./i18n.ts');

import createNextIntlPlugin from 'next-intl/plugin';


const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@wallet/constants",
    "@wallet/utils",
    "@wallet/evm",
    "@wallet/core",
    "@wallet/base",
    "@wallet/abi-decoder",
    "@wallet/gas-estimator"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

module.exports = withNextIntl(nextConfig);
