const mix = require('laravel-mix'),
  fs = require("fs"),
  path = require("path")

// -------------------------------------------------------------- Modules -- #
mix.js("resources/js/index.jsx", "public/js/kwerio.js").react()

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
  resolve: {
    alias: {
      Kwerio: path.resolve(__dirname, "resources/js"),
      KwerioComponents: path.resolve(__dirname, "resources/js/components"),
    },
  },
})

mix.extract({ to: "js/vendor.js" })

if (mix.inProduction()) {
  mix.version()
} else {
  mix.sourceMaps()
}

// -------------------------------------------------------------- Options -- #
mix.options({
  runtimeChunkPath: "js",
  hmrOptions: {
    host: "127.0.0.1",
    port: 8080,
  },
})
