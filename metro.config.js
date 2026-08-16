const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

let target = 'client';
try {
  target = fs.readFileSync(path.join(__dirname, '.app_target'), 'utf8').trim();
} catch (e) {
  target = process.env.APP_TARGET || 'client';
}
let customExts = [];

if (target === 'counsellor') {
  customExts = ['counsellor.tsx', 'counsellor.ts', 'counsellor.jsx', 'counsellor.js'];
} else {
  customExts = ['client.tsx', 'client.ts', 'client.jsx', 'client.js'];
}

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native')
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...customExts, ...sourceExts, 'svg']
  }
};

module.exports = mergeConfig(defaultConfig, config);

