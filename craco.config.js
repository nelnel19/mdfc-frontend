const { addBeforeLoader, loaderByName } = require("@craco/craco");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the source-map-loader rule
      const sourceMapLoaderRule = webpackConfig.module.rules.find(
        (rule) => rule.enforce === "pre" && rule.use && rule.use.loader.includes("source-map-loader")
      );

      // Exclude face-api.js from source-map-loader
      if (sourceMapLoaderRule) {
        sourceMapLoaderRule.exclude = [/node_modules\/face-api\.js/];
      }

      return webpackConfig;
    },
  },
};