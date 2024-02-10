/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface Window {
	wasm_bindgen: ((path: string) => Promise<void>) & {
		parseEvent(data: Uint8Array, name: string): any;
		parseTicks(data: Uint8Array, props: string[], ticks: Int32Array): any;
	};
}
