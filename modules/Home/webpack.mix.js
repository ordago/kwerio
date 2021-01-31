const mix = require("laravel-mix")

mix.js(`${__dirname}/resources/js/index.jsx`, "public/js/modules/home.js").react()
