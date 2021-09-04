const dotenv = require('dotenv')
const { join, resolve } = require('path')
// const { withSentryConfig } = require('@sentry/nextjs');

const nextJsConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_VERSION: process.env.VERSION,
    NEXT_PUBLIC_NETWORK: process.env.NETWORK,
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
      },
    }
    if (!options.isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.path = false
    }
    return config
  },
}

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = nextJsConfig

// module.exports =
//   process.env.NODE_ENV === 'production'
//     ? withSentryConfig(nextJsConfig, SentryWebpackPluginOptions)
//     : nextJsConfig;
