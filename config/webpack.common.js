const path = require('path');

exports.config = ({ entry, buildPath }) => ({
  context: path.resolve(__dirname, "../app"),
  entry: {
    app: entry,
  },
  output: {
    path: buildPath,
    filename: '[name].js',
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(entry, "components"),
      path.resolve(entry, "styles"),
    ],
    extensions: [".js", ".json", ".scss", ".ejs"],
    alias: {
      App: entry,
      Components: path.resolve(entry, 'components/'),
      Styles: path.resolve(entry, 'styles/'),
      Api: path.resolve(entry, 'api/'),
    }
  },
});
