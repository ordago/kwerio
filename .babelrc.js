const mix = require("laravel-mix"),
  merge = require("babel-merge")

const { presets, plugins } = mix.config.babel()

module.exports = merge({
  presets,
  plugins,
}, {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
  ],
})
