const mix = require('laravel-mix'),
  fs = require("fs")

const modules_dir = fs.opendirSync("./modules")

while ((dirent = modules_dir.readSync()) !== null) {
  let conf_file = `./modules/${dirent.name}/webpack.mix.js`

  if (fs.existsSync(conf_file)) {
    require(conf_file)
  }
}

modules_dir.closeSync()

mix.webpackConfig({
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    alias: {

    },
  },
})

mix
  .version()
  .sourceMaps()
