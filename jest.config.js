const fs = require("fs")

const modules_dir = fs.opendirSync("./modules")

let roots = [
  "resources/js",
]

let modules = [
  "node_modules",
  ...roots,
]

while ((dirent = modules_dir.readSync()) !== null) {
  let js_dir = `./modules/${dirent.name}/resources/js`

  if (fs.existsSync(js_dir)) {
    modules.push(js_dir)
    roots.push(js_dir)
  }
}

modules_dir.closeSync()

module.exports = {
  verbose: true,
  moduleDirectories: modules,
  roots: roots,
}
