export function IsValidFile(file?: File): boolean {
	if (!file || !file.name.endsWith(".dem")) {
		return false;
	}
	return true;
}
