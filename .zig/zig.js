const {
  FuseBox,
  SVGPlugin,
  CSSPlugin,
  BabelPlugin,
  SassPlugin,
  UglifyJSPlugin,
  EnvPlugin,
  QuantumPlugin,
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


const isProduction = process.env.NODE_ENV === 'production';

const fuseConfig = {
  homeDir: 'public',
  sourcemaps: !isProduction,
  hash: isProduction,
  cache: false,
  output: 'public/assets/js/bundle.js',
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
const zig = fuse.bundle('zig').instructions(serverConfig.index);

// Server
if (!isProduction) {
  zig.watch("src/**");
  fuse.dev(serverConfig);
  fuse.run();
};

