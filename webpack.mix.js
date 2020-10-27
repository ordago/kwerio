const mix = require('laravel-mix'),
  fs = require("fs")

// -------------------------------------------------------------- Modules -- #
mix.react("resources/js/index.jsx", "public/js/kwerio.js")

const modules_dir = fs.opendirSync("./modules")

while ((dirent = modules_dir.readSync()) !== null) {
  let conf_file = `./modules/${dirent.name}/webpack.mix.js`

  if (fs.existsSync(conf_file)) {
    require(conf_file)
  }
}

modules_dir.closeSync()

// ----------------------------------------- Webpack Custom Configuration -- #
mix.webpackConfig({
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    alias: {
      Kwerio: path.resolve(__dirname, "resources/js"),
      KwerioComponents: path.resolve(__dirname, "resources/js/components"),
    },
  },
})

mix.sourceMaps()

if (mix.inProduction()) {
  mix.version()
}

// ------------------------------------------------------------------ HMR -- #
mix.options({
  hmrOptions: {
    host: '127.0.0.1',
    port: 8080,
  },
})
