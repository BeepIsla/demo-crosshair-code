let Parser = (function () {
	let _aryPlayerInfos = [];
	let _intMaxPlayers = -1;
	let _intPlayerCountHistory = [];
	let _objDemo = null;

	let _Init = function () {
		DragNDrop.Init(_FileLoading, _FileLoaded);

		console.log("Ready!");
	};

	let _FileLoading = (file) => {
		$("#file-table").css("display", "none");
		$("#wait-for-file").css("display", "none");
		$("#spinner").css("display", "");
		$("#file-table > .table > tbody").empty();

		console.log(file);
	};

	let _FileLoaded = (buffer) => {
		_aryPlayerInfos.length = 0;
		_intMaxPlayers = -1;
		_intPlayerCountHistory.length = 0;

		if (_objDemo) {
			_objDemo.cancel();
		}

		_objDemo = new demofile.DemoFile();
		_objDemo.gameEvents.on("server_spawn", _Event_ServerSpawn);
		_objDemo.gameEvents.on("round_start", _Event_RoundStart);
		_objDemo.parse(buffer);
	};

	let _Event_ServerSpawn = (ev) => {
		_intMaxPlayers = ev.maxplayers;
	};

	let _Event_RoundStart = (ev) => {
		if (_objDemo.header.networkProtocol < 13748) {
			_objDemo.cancel();
			alert("Failed to parse: Demo too old\n\nOnly demos recorded after version 1.37.4.8 (Released 16h April 2020) can be parsed.");

			$("#file-table").css("display", "none");
			$("#wait-for-file").css("display", "");
			$("#spinner").css("display", "none");
			$("#file-table > .table > tbody").empty();
			return;
		}

		let playersThisRound = _objDemo.players.filter(p => !p.isFakePlayer && !p.isHltv);
		_intPlayerCountHistory.push(playersThisRound.length);

		_objDemo.players.forEach((player) => {
			if (player.isFakePlayer || player.isHltv) {
				return;
			}

			if (_aryPlayerInfos.find(p => p.steam64Id === player.steam64Id)) {
				return;
			}

			_aryPlayerInfos.push(player);
		});

		if (_intMaxPlayers >= 0) {
			// We have a maximum player number
			if (_aryPlayerInfos.length >= _intMaxPlayers) {
				// We reached the maximum amount of player infos
				_objDemo.cancel();
			}
		} else {
			// We don't have a maximum player number so lets try to figure out if we have them all or not, this is more unreliable
			if (_intPlayerCountHistory.length >= 3) {
				_intPlayerCountHistory.splice(0, _intPlayerCountHistory.length - 3);

				let totalPlayersHistory = _intPlayerCountHistory.reduce((a, b) => a + b, 0);
				if ((totalPlayersHistory / _intPlayerCountHistory.length) === playersThisRound.length) {
					// The past 3 rounds started with these amount of players, so lets assume we are done
					_objDemo.cancel();
				}
			}
		}

		_UpdatePlayerInfos();
	};

	let _UpdatePlayerInfos = () => {
		for (let player of _aryPlayerInfos) {
			if (player.added) {
				continue;
			}
			player.added = true;

			let tr = $("<tr></tr>");

			let name = $("<td></td>");
			name.text(player.name);

			let steamID = $("<td></td>");
			steamID.append("<a href=\"https://steamcommunity.com/profiles/" + player.steam64Id + "\" target=\"_blank\">" + player.steam64Id + "</a>");

			let chCode = $("<td></td>");
			chCode.text(player.resourceProp("m_szCrosshairCodes"));
			chCode.attr("data-content", "Copied to Clipboard");
			chCode.on("click", _OnChCodeClicked);

			tr.append(name).append(steamID).append(chCode);

			$("#file-table > .table > tbody").append(tr);
		}

		let children = $("#file-table > .table > tbody").children().length;
		if (children > 0) {
			$("#file-table").css("display", "");
			$("#spinner").css("display", "none");
		}
	};

	let _OnChCodeClicked = async (ev) => {
		let access = await navigator.permissions.query({
			name: "clipboard-write"
		});
		if (access.state === "denied") {
			alert("Cannot copy paste to clipboard due to browser restrictions.");
			return;
		}

		let el = $(ev.target);
		let chCode = el.text();
		await navigator.clipboard.writeText(chCode);

		el.popover("show");
		setTimeout(() => el.popover("hide"), 1000);
	};

	return {
		Init: _Init
	};
})();

(function () {
	$(window).ready(Parser.Init);
})();