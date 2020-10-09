const mix = require("laravel-mix")

mix.react(`${__dirname}/resources/js/signup.js`, "public/js/modules/signup.js")
mix.react(`${__dirname}/resources/js/login.js`, "public/js/modules/login.js")
