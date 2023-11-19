import { browser } from "$app/environment";
import { writable } from "svelte/store";

// dragging: true & file = File is currently being dragged over the document
// dragging: false & file = File was dropped, handle the file
// dragging: false = Nothing is happening
export const dragNDrop = writable<{
	dragging: boolean;
	file: File | undefined;
}>(
	{
		dragging: false,
		file: undefined
	},
	() => {
		function onDragOver(ev: DragEvent) {
			ev.preventDefault();

			dragNDrop.set({
				dragging: true,
				file: ev.dataTransfer?.files[0]
			});
		}

		function onDragLeave(ev: DragEvent) {
			ev.preventDefault();

			dragNDrop.set({
				dragging: false,
				file: undefined
			});
		}

		function onDrop(ev: DragEvent) {
			ev.preventDefault();

			dragNDrop.set({
				dragging: false,
				file: ev.dataTransfer?.files[0]
			});
		}

		if (browser) {
			document.addEventListener("dragover", onDragOver);
			document.addEventListener("dragleave", onDragLeave);
			document.addEventListener("drop", onDrop);
		}

		return () => {
			if (browser) {
				document.removeEventListener("dragover", onDragOver);
				document.removeEventListener("dragleave", onDragLeave);
				document.removeEventListener("drop", onDrop);
			}
		};
	}
);
