const path = require('path');

const destination = 'dist';
const mode = 'none'; // or production


module.exports = {
  mode,
  context: __dirname,
  entry: ['./src/index.js'],
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, destination),
    libraryTarget: 'this'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [{loader: "babel-loader"}, {loader: "template-string-loader"}]
    }
    ]
  }
};
