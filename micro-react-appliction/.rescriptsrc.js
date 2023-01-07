module.exports = {
  webpack: (config) => {
    config.output.library = "MicroReactApp";
    config.output.libraryTarget = "umd";
    config.output.chunkLoadingGlobal = `webpackJsonp_MicroRectApp`;
    config.output.globalObject = "window";

    return config;
  },

  devServer: (_) => {
    const config = _;

    config.headers = {
      "Access-Control-Allow-Origin": "*",
    };
    config.historyApiFallback = true;
    config.hot = true;
    config.liveReload = true;

    return config;
  },
};
