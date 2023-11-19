import { browser } from "$app/environment";
import { dragNDrop } from "./DragNDrop";

// "true" if a file has been selected, "false" otherwise
export function ShowFileDialog(): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (!browser) {
			resolve(false);
			return;
		}

		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".dem";
		input.addEventListener("cancel", () => {
			input.remove();
			resolve(false);
		});
		input.addEventListener("change", () => {
			input.remove();

			if (!input.files || input.files.length <= 0) {
				resolve(false);
			} else {
				dragNDrop.set({
					dragging: false,
					file: input.files[0]
				});
				resolve(true);
			}
		});
		input.addEventListener("error", () => {
			input.remove();
			reject(new Error("Failed to select file"));
		});
		input.click();
	});
}
