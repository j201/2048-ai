// Adapted from http://stackoverflow.com/a/10520017
var keydown = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Gah, screw chrome
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
	Object.defineProperty(oEvent, 'metaKey', {
                get : function() {
                    return false;
                }
    });     
	Object.defineProperty(oEvent, 'shiftKey', {
                get : function() {
                    return false;
                }
    });     

    if (oEvent.initKeyboardEvent) {
        oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
    } else {
        oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
    }

    oEvent.keyCodeVal = k;
	oEvent.metaKey = false;

    if (oEvent.keyCode !== k) {
        alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
    }

    document.dispatchEvent(oEvent);
};

function triggerKey(key) {
	keydown(key === ' ' ? 32 :
		key === 'Left' ? 37 :
		key === 'Up' ? 38 :
		key === 'Right' ? 39 :
		key === 'Down' ? 40 : 0);
}

function getTiles() {
	var tileElements = Array.prototype.slice.call(document.getElementsByClassName('tile'));
	return tileElements.map(function(tile) {
		return {
			value: Number(tile.className.match(/tile-(\d)/)[1]),
			x: Number(tile.className.match(/position-(\d)/)[1]) - 1, // zero-based numbering is best-based numbering
			y: Number(tile.className.match(/position-\d-(\d)/)[1]) - 1
		};
	});
}

function adjacent(t1, t2) {
	return (Math.abs(t1.x - t2.x) === 1 && t1.y === t2.y) ||
		(Math.abs(t1.y - t2.y) === 1 && t1.x == t2.x);
}

function tileAt(x, y, tiles) {
	return tiles.some(function(tile) {
		return tile.x === x && tile.y === y;
	});
}

function moveBetween(t1, t2, tiles) {
	// Assumes adjacency
	return t1.x !== t2.x ?
		(t1.x === 0 || t2.x === 0 || ((t1.x === 1 || t2.x === 1) && tileAt(0, t1.y, tiles)) ? "Left" : "Right") :
		(t1.y === 0 || t2.y === 0 || ((t1.y === 1 || t2.y === 1) && tileAt(t1.x, 0, tiles)) ? "Up" : "Down");
}

function randomMove() {
	return ["Up", "Down", "Left", "Right"][Math.floor(Math.random() * 4)];
}

function move(tiles) {
	var sorted = tiles.sort(function(t1, t2) {
		return t1.value - t2.value;
	});
	for (var i = 0; i < sorted.length - 1; i++) {
		if (adjacent(sorted[i], sorted[i + 1]))
			return moveBetween(sorted[i], sorted[i + 1], tiles);
	}
	return randomMove();
}

function gameOver() {
	return document.getElementsByClassName('game-over').length > 0;
}

function gameWon() {
	return document.getElementsByClassName('game-won').length > 0;
}

(function tick() {
	if (gameWon()) return;
	var oldNumOfTiles = document.getElementsByClassName('tile').length;
	triggerKey(gameOver() ? " " : move(getTiles()));
	if (oldNumOfTiles === document.getElementsByClassName('tile').length)
		triggerKey(randomMove()); // Prevents getting stuck
	setTimeout(tick, 50);
})();
