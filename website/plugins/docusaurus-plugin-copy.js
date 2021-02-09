const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-copy',
    configureWebpack(config, isServer, utils) {
      return {
        plugins: [
          new CopyWebpackPlugin({
            patterns: options.patterns,
          }),
        ],
      };
    },
  };
};
