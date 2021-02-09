module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-alias',
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          alias: options.alias,
        },
      };
    },
  };
};
