const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: [
      ...defaultConfig.resolver.assetExts,
      'jpg',
      'jpeg',
      'png',
      'gif',
      'webp',
      'bmp',
      'tiff',
      'svg',
    ],
    sourceExts: defaultConfig.resolver.sourceExts.filter(
      ext => !['jpg', 'jpeg', 'png', 'gif'].includes(ext),
    ),
  },
};

module.exports = mergeConfig(defaultConfig, config);
