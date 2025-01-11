module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-elm',
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          extensions: ['.elm'],
        },
        module: {
          rules: [
            {
              test: /\.elm$/,
              exclude: [/elm-stuff/, /node_modules/],
              use: [
                'elm-hot-webpack-loader',
                {
                  loader: 'elm-webpack-loader',
                  options: {
                    cwd: options.cwd,
                  },
                },
              ],
            },
          ],
        },
      };
    },
  };
};
