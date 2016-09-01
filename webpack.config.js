'use strict';

const webpack = require('webpack');

module.exports = {

  context: __dirname,

  target: 'web',

  entry: './index.js',

  output: {
    path: __dirname,
    filename: '[name].js',
    library: ['eventTracker'],
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: [
      '',
      '.js',
    ],
    modulesDirectories: [
      'node_modules',
    ],
  },

  plugins: [
    new webpack.NoErrorsPlugin,
    new webpack.IgnorePlugin(/vertx/),
    new webpack.optimize.OccurenceOrderPlugin,
    new webpack.optimize.DedupePlugin,
    new webpack.optimize.AggressiveMergingPlugin,
    new webpack.BannerPlugin([
      '@license event-tracker.js Copyright(c) 2016 IMJ Co., Ltd.',
      'https://github.com/tsukurite/event-tracker.js',
      'Released under the MIT license.',
    ].join('\n'), {
      options: {
        raw: false,
        entryOnly: true,
      },
    })
  ],

};
