import fs from "fs";
import path from "path";

const root = "./submodules/demoparser2/src/wasm/www/pkg";
const script = fs.readFileSync(path.join(root, "demoparser2.js"), "utf8");
const match = script.match(/let script_src;.*let wasm;/gims);
if (!match) {
	throw new Error("Could not find script_src");
}

const replace = "wasm_bindgen = Object.assign(init, { initSync }, __exports);";
fs.writeFileSync(
	path.join(root, "demoparser2.js"),
	script.replace(replace, `window.${replace}`).replace(match[0], `let script_src;\n    let wasm;`)
);
