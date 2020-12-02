let game = new Game();
const button = document.getElementById('begin-game');

/**
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
button.addEventListener('click', function () {
	game.startGame();
	this.style.display = 'none';
	document.getElementById('play-area').style.opacity = '1';
});

/**
 * Add an event listener to the Replay game button if the game is over
 */
if (game.isGameOver) {
	const replay = document.getElementById('replay');
	replay.addEventListener('click', function () {
		window.location.reload();
	});
}

/**
 * Listen for keyboard actions to move tokens
 */
document.addEventListener('keydown', function (event) {
	game.handleKeyDown(event);
});
