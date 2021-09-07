const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  reactDocgen: false,
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config, { configType }) => {
    // styles
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    })
    config.resolve.roots = [
      path.resolve(__dirname, '../public'),
      'node_modules',
    ]
    config.resolve.fallback.fs = false
    config.resolve.fallback.path = false
    config.resolve.fallback.os = false
    return config
  },
}
