const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    index: './src/index.ts',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    allowedHosts: "all",
  },
  externalsType: 'script',
  externals: {
    '@yandex/ymaps3-types': [
      `promise new Promise((resolve) => {
            if (typeof ymaps3 !== 'undefined') {
              return ymaps3.ready.then(() => resolve(ymaps3));
            }
  
            const script = document.createElement('script');
            script.src = "https://api-maps.yandex.ru/3.0/?apikey=52733e88-5e93-44a9-a999-5e5c4d147332&lang=ru_RU";
            script.async = true;
            script.onload = () => {
              ymaps3.ready.then(() => {
                document.getElementById("root").innerHTML = '';
                resolve(ymaps3);
              });
            };
            document.body.appendChild(script);
          })`
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module.css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: 'single',
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
