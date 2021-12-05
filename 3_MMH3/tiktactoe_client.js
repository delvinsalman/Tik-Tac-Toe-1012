var origBoard;
const xPlayer = 'O';
const AI = 'X';
const winningConditions = [
	[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]
];

const cube = document.querySelectorAll('.cube');
begins();

function begins() {
	document.querySelector(".ends").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cube.length; i++) {
		cube[i].addEventListener('click', turnClick, false); 
		cube[i].style.removeProperty('background-color'); // remove background color when hit restart button
		cube[i].innerText = ''; //remove text
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, xPlayer)
		if (!checks(origBoard, xPlayer) && !tie()) turn(Spot(), AI);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let Won = checks(origBoard, player)
	if (Won) lost(Won)
}

function checks(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let Won = null;
	for (let [index, win] of winningConditions.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			Won = {index: index, player: player};
			break;
		}
	}return Won;
}

function lost(Won) {
	for (let index of winningConditions[Won.index]) {
		document.getElementById(index).style.backgroundColor =
			Won.player == xPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cube.length; i++) {
		cube[i].removeEventListener('click', turnClick, false);
	}
	statewinner(Won.player == xPlayer ? "Winner" : "You lose");
}

function statewinner(who) {
	document.querySelector(".ends").style.display = "block";
	document.querySelector(".ends .text").innerText = who;
}

function remove() {
	return origBoard.filter(s => typeof s == 'number');
}

function Spot() {
	return show(origBoard, AI).index;
}

function tie() {
	if (remove().length == 0) {
		for (var i = 0; i < cubes.length; i++) {
			cube[i].style.backgroundColor = "green";
			cube[i].removeEventListener('click', turnClick, false);
		}
		statewinner("Tie!")
		return true;
	}
	return false;
}

function show(clean, player) {
	var availSpots = remove();

	if (checks(clean, xPlayer)) {
		return {score: -10};
	} else if (checks(clean, AI)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = clean[availSpots[i]];
		clean[availSpots[i]] = player;

		if (player == AI) {
			var result = show(clean, xPlayer);
			move.score = result.score;
		} else {
			var result = show(clean, AI);
			move.score = result.score;
		}

		clean[availSpots[i]] = move.index;

		moves.push(move);
	}

	var best;
	if(player === AI) {
		var best = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > best) {
				best = moves[i].score;
				best = i;
			}
		}} else {
		var best = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < best) {
				best = moves[i].score;
				best = i;
			}
		}
	} return moves[best];
}