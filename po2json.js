const po2json = require("po2json"),
  fs = require("fs"),
  path = require("path"),
  _ = require("lodash")

// Load all the available translations. (kwerio core + modules)
const resources = [{
  name: "core",
  dir: __dirname + "/resources/i18n"
}],
  modules = fs.readdirSync("./modules", { withFileTypes: true })

for (let i = 0; i < modules.length; i ++) {
  if (modules[i].isDirectory()) {
    let i18n = `${__dirname}/modules/${modules[i].name}/resources/i18n`

    if (fs.existsSync(i18n)) {
      resources.push({
        name: modules[i].name,
        dir: i18n,
      })
    } else {
      console.error(`[ MISSING ]  Module '${modules[i].name}' does not have translations`)
    }
  }
}

// Recreate translations directory.
const public = __dirname + "/public/i18n"
fs.rmdirSync(public, { recursive: true })

// Convert PO files to JSON and store it to the corresponding public
// directory.
for (let i = 0; i < resources.length; i ++) {
  let rsc = resources[i]

  // Create the output directory
  let files = fs.readdirSync(rsc.dir),
    output_dir = `${public}/${rsc.name}`

  if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir, { mode: 0755, recursive: true })
  }

  // Read .PO files and convert them to JSON asynchronously
  for (let i = 0; i < files.length; i ++) {
    if (path.extname(files[i]) !== ".po") {
      continue
    }

    po2json.parseFile(`${rsc.dir}/${files[i]}`, (err, data) => {
      if (err !== null) {
        console.error(err)
      } else {
        let filename = files[i].split('.').slice(0, -1).join('.'),
          output_file = `${output_dir}/${filename}.json`

        let output = {}

        // Remove metadata, and fix "Some Text": [null, "Some Text Translated"]
        // so it can be consumed by the frontend properly.
        for (let key in data) {
          if (key.trim().length === 0) {
            continue
          }

          let value = data[key]

          if (_.isArray(value)) {
            output[key] = value.join("")
          } else if (_.isString(value)) {
            output[key] = value
          } else {
            // The only case i saw now is [null, "value"], if there is any
            // other penguins, report them as errors, so they can be fixed.
            throw new Error(`PO value in '${rsc.dir}/${files[i]}' has an unknown value`)
          }
        }

        // Save the file.
        fs.writeFile(output_file, JSON.stringify(output), err => {
          if (err !== null) {
            console.error(err)
          } else {
            console.log(`[ OK ]  ${output_file}`)
          }
        })
      }
    })
  }
}
