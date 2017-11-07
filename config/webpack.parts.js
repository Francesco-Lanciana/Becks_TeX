const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// Style loaders to be used in production (SASS files)
const prodSassLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      sourceMap: false,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => ([
        require('postcss-cssnext')(),
      ]),
      sourceMap: false,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: false,
    },
  },
];

// Style loaders to be used in development (SASS files)
const devSassLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => ([
        require('postcss-cssnext')(),
      ]),
      sourceMap: true,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  },
];

// Loaders and corresponding options applied to files in production
exports.extractStyleSheets = ({ include, exclude } = {}) => {

  const plugin = new ExtractTextPlugin({
    filename: '[name].bundle.css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          include,
          exclude,
          use: plugin.extract({
            use: prodSassLoaders,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [plugin],
  };
};

// Loaders and corresponding options applied to files in development,
// as style sheets are only extracted in production.
exports.loadStyleSheets = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        include,
        exclude,
        use: devSassLoaders,
      },
    ],
  },
});

// Plugin to remove unused css from build
exports.purifyCSS = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths }),
  ],
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g)$/i,
        include,
        exclude,

        use: [
          {
            loader: 'url-loader',
            options,
          },
          {
            loader: 'image-webpack-loader',
            options: {
              pngquant: {
                quality: '35-60',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: 'file-loader',
      },
    ],
  },
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/,
        include,
        exclude,

        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        },
      },
    ],
  },
});

exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,

        loader: 'babel-loader',
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

exports.extractBundles = (bundles) => ({
  plugins: bundles.map((bundle) => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});

exports.clean = ({root, path}) => ({
  plugins: [
    new CleanWebpackPlugin([path], {
      root,
    }),
  ],
});

exports.minifyJavaScript = () => ({
  plugins: [
    new MinifyPlugin(),
  ],
});

exports.extractHTML = ({ template }) => {
  return {
      plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        //favicon: '../app/favicon.png',
        template,
        inject: true,
      }),
    ],
  }
};

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});


exports.compressBuild = () => ({
  plugins: [
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};
