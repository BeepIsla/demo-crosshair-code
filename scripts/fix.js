import fs from "fs";

// wasm-pack seems to output a not-so-great package.json
const pkg = JSON.parse(fs.readFileSync("./node_modules/demoparser2/package.json", "utf8"));
pkg.main = "demoparser2.js";
pkg.type = "module";
fs.writeFileSync("./node_modules/demoparser2/package.json", JSON.stringify(pkg, null, "\t"));
