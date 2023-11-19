// This function never throws
export async function CopyToClipboard(code: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(code);
		return true;
	} catch {
		return false;
	}
}
