/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')

module.exports = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VERSION: process.env.VERSION,
    NEXT_PUBLIC_NETWORK: process.env.NETWORK,
    NEXT_PUBLIC_IDO_START: process.env.IDO_START,
    NEXT_PUBLIC_IDO_RAISED: process.env.IDO_RAISED,
  },
  webpack: (config, options) => {
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.svg$/,
          loader: '@svgr/webpack',
        },
      ],
    }
    // ensure only one react is loaded (mainly for dev)
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        react: resolve('./node_modules/react'),
        'react-dom': resolve('./node_modules/react-dom'),
      },
    }
    if (!options.isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.path = false
    }
    return config
  },
}
