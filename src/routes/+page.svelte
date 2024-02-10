<script lang="ts">
	import { onMount } from "svelte";
	import { dragNDrop } from "$lib/helpers/DragNDrop";
	import { ParseFile } from "$lib/helpers/ParseFile";
	import { IsValidFile } from "$lib/helpers/IsValidFile";
	import { CopyToClipboard } from "$lib/helpers/CopyToClipboard";
	import type { CrosshairCode } from "$lib/types/CrosshairCode";
	import { ShowFileDialog } from "$lib/helpers/ShowFileDialog";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { base } from "$app/paths";

	let codes: CrosshairCode[] = [];
	let isLoading = true;

	onMount(() => {
		isLoading = true;

		// Prefix and suffix with a slash
		let prefix = base.startsWith("/") ? base : `/${base}`;
		if (!prefix.endsWith("/")) {
			prefix += "/";
		}
		const demoparser2url = new URL(
			`${prefix}_app/immutable/assets/demoparser2/demoparser2.js`,
			$page.url
		).href;

		import(/* @vite-ignore */ demoparser2url)
			.then(async () => {
				await window.wasm_bindgen(demoparser2url.replace(".js", "_bg.wasm"));
			})
			.catch((err: Error) => {
				showError(err, true);
			})
			.finally(() => {
				isLoading = false;
			});
	});

	function showError(err: Error, fatal?: boolean) {
		console.error(err);

		if (browser) {
			if (fatal) {
				alert(
					`An error occurred: ${String(
						err
					)}\n\nThis will prevent the website from working.\nPlease reload the page.`
				);
			} else {
				alert(
					`An error occurred: ${String(err)}\n\nPlease select another file or report this issue.`
				);
			}
		}
	}

	function directSelectFile() {
		// Don't allow double
		if (isLoading) {
			return;
		}

		isLoading = true;
		ShowFileDialog()
			.then((fileSelected) => {
				// We want the loading icon to continue showing if a file was selected
				// Internally "ShowFileDialog" sets "dragNDrop" in a way so that the below "dragNDrop.subscribe" gets called
				if (!fileSelected) {
					isLoading = false;
				}
			})
			.catch((err) => {
				showError(err);
				isLoading = false;
			});
	}

	function copyCode(code: string) {
		CopyToClipboard(code)
			.then(() => {
				alert(`Copied "${code}" to clipboard`);
			})
			.catch((err) => {
				alert(`Failed to copy to clipboard: ${err}`);
			});
	}

	dragNDrop.subscribe((value) => {
		if (!value.dragging && value.file) {
			// File was dropped
			if (!IsValidFile(value.file)) {
				alert(
					"Invalid file. Only .dem files are supported!\n\nYou may have to extract the file using 7zip."
				);
				return;
			}

			isLoading = true;
			ParseFile(value.file)
				.then((c) => {
					codes = c;
				})
				.catch((err) => {
					showError(err);
				})
				.finally(() => {
					isLoading = false;
				});
		}
	});
</script>

<div class="mx-auto flex h-screen w-full max-w-[1024px] flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl text-white">CS2 Demo Crosshair Code Extractor</h1>

	<a
		href="https://github.com/BeepIsla/demo-crosshair-code"
		target="_blank"
		class="mb-4 flex items-center gap-1 text-white hover:underline"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
			></path>
		</svg>
		GitHub
	</a>

	<div
		class="group flex h-[300px] w-full cursor-pointer place-content-center place-items-center justify-center gap-6 rounded-xl border-2 border-dashed border-zinc-400 p-8 transition {isLoading
			? 'cursor-wait'
			: 'hover:border-transparent hover:bg-[#EDEDED]'}"
		role="button"
		tabindex="0"
		on:click="{directSelectFile}"
		on:keypress
	>
		{#if isLoading}
			<h1 class="animate-pulse text-5xl font-bold uppercase text-zinc-400">Loading...</h1>
		{:else}
			<div class="">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="128"
					height="128"
					viewBox="0 0 24 24"
					class="text-white group-hover:text-black"
				>
					<path
						fill="currentColor"
						d="M11 20H6.5q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20H13v-7.15l1.6 1.55L16 13l-4-4l-4 4l1.4 1.4l1.6-1.55Z"
					></path>
				</svg>
			</div>

			<div class="">
				<h2 class="text-base text-white group-hover:text-black">Drag & drop your .dem file here</h2>
				<h2 class="text-sm italic text-white group-hover:text-black">
					...or click on this box to select a file from your device
				</h2>
			</div>
		{/if}
	</div>

	<h1 class="mb-4 mt-4 text-lg text-white">
		Found {codes.length} crosshair code{codes.length === 1 ? "" : "s"}.
	</h1>
	<ul class="w-full">
		<li class="flex justify-between text-white">
			<em class="text-left font-semibold not-italic">
				SteamID
				<p class="text-sm font-normal italic">Click to open profile</p>
			</em>
			&nbsp;
			<em class="text-right font-semibold not-italic">
				Code
				<p class="text-sm font-normal italic">Click to copy</p>
			</em>
		</li>

		{#each codes as code}
			<li class="flex justify-between text-white">
				<a
					href="https://steamcommunity.com/profiles/{code.steamID}"
					target="_blank"
					rel="noreferrer noreopener"
					class="transition hover:text-pink-400 active:scale-90"
				>
					{code.steamID}: {code.name}
				</a>
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				<div
					class="cursor-pointer transition hover:text-pink-400 active:scale-90"
					role="button"
					tabindex="0"
					on:click="{() => copyCode(code.code)}"
					on:keydown
				>
					<code>
						{code.code}
					</code>
				</div>
			</li>
		{/each}
	</ul>
</div>
