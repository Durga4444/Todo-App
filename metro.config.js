// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  tslib: require.resolve('tslib/tslib.es6.js'),
};

module.exports = config;
