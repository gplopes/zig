// CSSPlugin Instance
exports.cssConfig = {
  group: 'assets/css/main.css',
  outFile: `./public/assets/css/main.css`

};

// SassPlugin Instance
exports.sassConfig = {
  outputStyle: 'compressed'
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
  index: '> index.js',
  port: 8000,
  httpServer: true,
};
