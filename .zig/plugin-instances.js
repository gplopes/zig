const {
  __rootDir,
  __publicDir,
 } = require('./zig-path');

// CSSPlugin Instance
exports.cssConfig = {
  group: 'assets/css/main.css',
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
  uglify: true
};

exports.serverConfig = {
  open : true,
  root: `${__rootDir}/public`,
  index: `> index.js`,
  port: 8000,
};
