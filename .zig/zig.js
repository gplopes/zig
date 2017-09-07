// -- Fusebox
const {
  FuseBox,
  SVGPlugin,
  CSSPlugin,
  BabelPlugin,
  SassPlugin,
  PostCSSPlugin,
  UglifyJSPlugin,
  EnvPlugin,
  QuantumPlugin
} = require('fuse-box');

// -- Plugins Configuration
const {
  cssConfig,
  sassConfig,
  postCSSConfig,
  babelConfig,
  uglifyConfig,
  serverConfig,
  quantumConfig
} = require('./plugin-instances');

// -- Paths
const { __rootDir, __publicDir } = require('./zig-path');

// -- Productions
const isProduction = process.env.NODE_ENV === 'production';

// -- Config
const fuseConfig = {
  homeDir: `${__rootDir}/src`,
  sourcemaps: !isProduction,
  hash: isProduction,
  cache: !isProduction,
  log: true,
  debug: true,
  output: `${__publicDir}/js/$name.js`,
  // shim: {
  //   jquery: {
  //     source: `${__rootDir}/node_modules/jquery/dist/jquery.js`,
  //     exports: '$'
  //   }
  // }
};

// -- Plugins
fuseConfig.plugins = [SVGPlugin(), BabelPlugin(babelConfig)];

// -- Dev
if (!isProduction) {
  const devPlugins = [
    [SassPlugin(sassConfig), PostCSSPlugin(postCSSConfig), CSSPlugin()]
  ];
  fuseConfig.plugins = fuseConfig.plugins.concat(devPlugins);
}

// -- Prod
if (isProduction) {
  const prodPlugins = [
    UglifyJSPlugin(uglifyConfig),
    EnvPlugin({ NODE_ENV: 'production' }),
    QuantumPlugin(quantumConfig),
    [SassPlugin(sassConfig), PostCSSPlugin(postCSSConfig), CSSPlugin(cssConfig)]
  ];
  fuseConfig.plugins = fuseConfig.plugins.concat(prodPlugins);
}

// -- Create FuseBox Instance
const fuse = new FuseBox(fuseConfig);
const zig = fuse.bundle('bundle').instructions(serverConfig.index);

// -- Server
if (!isProduction) {
  fuse.dev(serverConfig);
  zig.hmr().watch(`${__rootDir}/src/**/**`);
  fuse.run();
}

if (isProduction) {
  fuse.run();
}
