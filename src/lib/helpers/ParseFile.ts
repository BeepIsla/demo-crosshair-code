import type { CrosshairCode } from "$lib/types/CrosshairCode";

export function ParseFile(file: File): Promise<CrosshairCode[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("error", () => {
			reject(new Error("Failed to load file"));
		});
		reader.addEventListener("load", (ev) => {
			if (!ev.target || !ev.target.result || typeof ev.target.result === "string") {
				reject(new Error("Could not load file"));
				return;
			}

			const data = new Uint8Array(ev.target.result);
			try {
				const playerSpawns: Map<string, number>[] = window.wasm_bindgen.parseEvent(
					data,
					"round_freeze_end"
				);
				const ticks = playerSpawns.map((s) => s.get("tick"));
				const players: Map<string, string>[] = window.wasm_bindgen.parseTicks(
					data,
					["crosshair_code"],
					ticks as unknown as Int32Array
				);

				const codes: CrosshairCode[] = [];
				for (const player of players) {
					if (codes.findIndex((c) => c.steamID === player.get("steamid")) >= 0) {
						continue;
					}

					codes.push({
						steamID: player.get("steamid") ?? "",
						name: player.get("name") ?? "",
						code: player.get("crosshair_code") ?? ""
					});
				}
				resolve(codes);
			} catch (err) {
				reject(err);
			}
		});
		reader.readAsArrayBuffer(file);
	});
}
