import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "submodules/demoparser2/src/wasm/www/pkg/demoparser2_bg.wasm",
					dest: "_app/immutable/assets/demoparser2"
				},
				{
					src: "submodules/demoparser2/src/wasm/www/pkg/demoparser2.js",
					dest: "_app/immutable/assets/demoparser2"
				}
			]
		}),
		sveltekit()
	]
});
