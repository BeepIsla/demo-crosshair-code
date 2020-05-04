let DragNDrop = (function () {
	let _fnLoadingCB = null;
	let _fnFinishedCB = null;

	let _Init = (loadingCallback, finishedCallback) => {
		_fnLoadingCB = loadingCallback;
		_fnFinishedCB = finishedCallback;
	};

	let _PreventDefault = (ev) => {
		ev.stopPropagation();
		ev.preventDefault();
		return false;
	};

	let _GetFile = (ev) => {
		if (!_fnLoadingCB || !_fnFinishedCB) {
			return false;
		}

		let files = ev.originalEvent.dataTransfer.files;
		if (!files || files.length <= 0) {
			// No file we want
			return false;
		}

		_fnLoadingCB(files[0]);

		files[0].arrayBuffer().then(_fnFinishedCB);
		return false;
	};

	return {
		Init: _Init,
		PreventDefault: _PreventDefault,
		GetFile: _GetFile
	};
})();

(function () {
	$(document).on("drop dragover dragleave", DragNDrop.PreventDefault);
	$(document).on("drop", DragNDrop.GetFile);
})();