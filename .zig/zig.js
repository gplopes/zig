// -- Fusbox
const {
  FuseBox,
  SVGPlugin,
  CSSPlugin,
  BabelPlugin,
  SassPlugin,
  UglifyJSPlugin,
  EnvPlugin,
  QuantumPlugin,
  Sparky,
} = require('fuse-box');

// -- Plugins Configuration
const {
  cssConfig,
  sassConfig,
  babelConfig,
  uglifyConfig,
  serverConfig,
  quantumConfig,
} = require('./plugin-instances');

// -- Paths
const {
  __rootDir,
  __publicDir,
} = require('./zig-path');



const isProduction = process.env.NODE_ENV === 'production';

const fuseConfig = {
  homeDir: `${__rootDir}/src`,
  sourcemaps: !isProduction,
  hash: isProduction,
  cache: true,
  log: true,
  debug: true,
  output: `${__publicDir}/js/$name.js`,
};

// Plugins
fuseConfig.plugins = [
  SVGPlugin(),
  [SassPlugin(sassConfig), CSSPlugin(cssConfig)],
  BabelPlugin(babelConfig),
];

// Prod
if (isProduction) {
  const prodPlugins = [
    UglifyJSPlugin(uglifyConfig),
    EnvPlugin({ NODE_ENV: "production" }),
    QuantumPlugin(quantumConfig),
  ];
  fuseConfig.plugins = fuseConfig.plugins.concat(prodPlugins)
}


// Create FuseBox Instance
const fuse = new FuseBox(fuseConfig);
const zig = fuse.bundle('bundle').instructions(serverConfig.index);

// Server
if (!isProduction) {
  fuse.dev(serverConfig)
  zig.hmr().watch(`${__rootDir}/src/**`);
  fuse.run();
  Sparky.watch([`${__rootDir}/src/styles/**`]);
};

