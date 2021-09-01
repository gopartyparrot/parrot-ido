const fs = require('fs')
const dotenv = require('dotenv')
const { join, resolve } = require('path')
// const { withSentryConfig } = require('@sentry/nextjs');

dotenv.config({ path: join(__dirname, `./.env.${process.env.CHANNEL}`) })

const nextJsConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  env: {
    // NextJs will bundle all this env in the static files
    // NEXT_PUBLIC_XXX will be available at run-time, while the others can only be access at build-time/ssr
    NETWORK: process.env.NETWORK,
    CHANNEL: process.env.CHANNEL,
    VERSION: process.env.VERSION,
    SENTRY_DSN: process.env.SENTRY_DSN,
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
//   process.env.CHANNEL === 'prod' && process.env.NODE_ENV === 'production'
//     ? withSentryConfig(nextJsConfig, SentryWebpackPluginOptions)
//     : nextJsConfig;
