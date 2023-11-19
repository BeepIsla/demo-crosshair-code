# Demo Crosshair Code

Parse crosshair codes out of any CS2 demo you want! **CSGO is not supported.**

**Available at [beepisla.github.io/demo-crosshair-code](https://beepisla.github.io/demo-crosshair-code/)**

![](preview.png)

## Build

The [wasm demoparser](https://github.com/LaihoE/demoparser) doesn't seem to be on NPM (Only the node version is on npm right now) so I just submoduled it into this project under `src/lib/demoparser`

1. `npm i`
2. `npm run dev` / `npm run build`

## Credits

- [LaihoE's demoparser](https://github.com/LaihoE/demoparser)
- [Svelte](https://kit.svelte.dev/)
- [Tailwind](https://tailwindcss.com/)
