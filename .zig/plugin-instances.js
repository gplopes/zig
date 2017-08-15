const {
  __rootDir,
  __publicDir,
} = require('./zig-path');

// -- PostCSS Plugins
const autoprefixer = require('autoprefixer');


// PostCSS Instance,
exports.postCSSConfig = [
  autoprefixer
];

// CSSPlugin Instance
exports.cssConfig = {
  group: 'main.css',
  outFile: `${__publicDir}/css/main.css`
};

// SassPlugin Instance
exports.sassConfig = {
  outputStyle: 'compressed',
  importer: true,
};

// BabelPlugin Instance
exports.babelConfig = {
  test: /\.js$/,
  config: {
    sourceMaps: true,
    presets: ['es2015'],
  },
};

exports.uglifyConfig = {
  compress: {
    global_defs: {
      DEBUG: false,
    },
  },
};

exports.quantumConfig = {
  removeExportsInterop: false,
  uglify: true,
  treeshake: true,
};

exports.serverConfig = {
  open : true,
  root: `${__rootDir}/public`,
  index: `> index.js`,
  port: 8000,
};
