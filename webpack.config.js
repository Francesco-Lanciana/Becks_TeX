const path = require('path');
const merge = require('webpack-merge');

const parts = require('./config/webpack.parts');
const common = require('./config/webpack.common');
const devConfig = require('./config/webpack.development');
const prodConfig = require('./config/webpack.production');


const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = common.config({
  entry: PATHS.app,
  buildPath: PATHS.build,
});

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, prodConfig(PATHS));
  }

  return merge(commonConfig, devConfig(PATHS));
};
