const merge = require('webpack-merge');
const path = require('path');
const glob = require('glob');

const webpack = require('webpack');
const parts = require('./webpack.parts');

module.exports = (PATHS) => {
  return merge([
    {
      performance: {
        hints: 'warning', // 'error' or false are valid too
        maxEntrypointSize: 150000, // in bytes
        maxAssetSize: 450000, // in bytes
      },
      output: {
        chunkFilename: '[name].bundle.js',
        filename: '[name].bundle.js',
      },
    },
    parts.clean({
      root: path.join(__dirname, '..'),
      path: 'build',
    }),
    parts.minifyJavaScript(),
    parts.minifyCSS({
      options: {
        discardComments: {
          removeAll: true,
        },
        // Run cssnano in safe mode to avoid
        // potentially unsafe transformations.
        safe: true,
      },
    }),
    parts.extractStyleSheets(),
    parts.purifyCSS({
      paths: glob.sync(`${PATHS.app}/**/*.js`, {nodir: true}),
    }),
    parts.loadImages({
      options: {
        limit: 500, // After optimization limit
        name: '[name].[hash:8].[ext]',
      },
    }),
    parts.loadFonts({
      options: {
        name: './fonts/[name].[hash:8].[ext]',
        publicPath: '../',
      },
    }),
    parts.extractHTML({
      template: path.join(PATHS.app, 'index.template.ejs'),
    }),
    parts.loadJavaScript({
      include: PATHS.app,
      exclude: /(node_modules|bower_components)/,
    }),
    parts.setFreeVariable(
      'process.env.NODE_ENV',
      'production'
    ),
    //parts.compressBuild(),
    //parts.generateSourceMaps({ type: 'source-map' }),
  ]);
};
