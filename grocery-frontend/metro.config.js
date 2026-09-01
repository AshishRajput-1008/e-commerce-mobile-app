const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Some packages (including Zustand) expose an ESM build containing
// `import.meta`. Metro's web output is served as a classic script, so use the
// package's React Native/CommonJS entry instead.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
