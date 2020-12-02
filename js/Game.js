class Game {
	constructor(index = 0) {
		this.board = new Board();
		this.score = 0;
		this.gameOver = false;
		this.canMove = false;
		this.index = index;
	}

	/**
	 * Initializes game.
	 */
	startGame() {
		this.board.drawHTMLBoard();
		this.canMove = true;
		this.board.scoreBox.innerText = this.score;
		this.newToken();
	}

	/**
	 * Find all available free spaces on the board
	 * @return  {Array}   An array of Space objects
	 */
	get freeSpaces() {
		const board = this.board;
		const space = board.spaces;
		let freeSpaces = [];

		for (let x = 0; x < board.columns; x++) {
			for (let y = 0; y < board.rows; y++) {
				if (space[x][y].token === null) {
					freeSpaces.push(space[x][y]);
				}
			}
		}
		return freeSpaces;
	}

	/**
	 * Choose a random free space
	 * @return  {Space}		The free space object
	 */
	randomFreeSpace() {
		const free = this.freeSpaces;
		if (free.length > 0) {
			// Grab a random Space object and assign it the Token
			const randomFreeSpace = free[Math.floor(Math.random() * free.length)];

			//Return the Space object for reference when drawing the Token
			return randomFreeSpace;
		}
	}

	handleKeyDown(event) {
		this.isGameOver();
		this.canMove = false;
		const game = this;

		if ('ArrowLeft' === event.key) {
			game.move('left', function () {
				game.merge('left', function () {
					game.move('left');
				});
			});
		} else if ('ArrowRight' === event.key) {
			game.move('right', function () {
				game.merge('right', function () {
					game.move('right');
				});
			});
		} else if ('ArrowDown' === event.key) {
			game.move('down', function () {
				game.merge('down', function () {
					game.move('down');
				});
			});
		} else if ('ArrowUp' === event.key) {
			game.move('up', function () {
				game.merge('up', function () {
					game.move('up');
				});
			});
		}

		if (this.canMove) {
			this.newToken();
			this.board.scoreBox.innerText = this.score;
		}
	}

	/**
	 * Get all tokens currently on the board in columns
	 * @return  {Array}		Array of tokens on the board
	 */
	getAllTokens() {
		let tokens = [];
		const space = this.board.spaces;

		for (let x = 0; x < this.board.columns; x++) {
			for (let y = 0; y < this.board.rows; y++) {
				if (!this.isSpaceEmpty(space[x][y])) {
					tokens.push(space[x][y].token);
				}
			}
		}
		//Return unique array
		return [...new Set(tokens)];
	}

	/**
	 * Create the new token, assign it to a random space, and draw it on the board
	 */
	newToken() {
		const token = this.createNewToken();
		this.assignTokenToRandomSpace(token);
		token.drawHTMLToken(token.x, token.y);
	}

	/**
	 * Create a new Token with an incremented index ID
	 * @return  {Object}	Token object
	 */
	createNewToken() {
		this.index++;
		const token = new Token(this.index);
		return token;
	}

	/**
	 * Assign a Token object to a given space
	 * @param  {Object}		Token object to assign to the space
	 * @param  {Object}		Space object to assign the token to
	 * @return {Bool}		Returns false if no spaces are available
	 */
	assignTokenToSpace(token, space) {
		if (token && space) {
			space.token = token;
			token.x = space.x;
			token.y = space.y;
		}
	}

	/**
	 * Assign a Token object to a given space
	 * @param  {Object}		Token object to assign to the space
	 * @param  {Object}		Space object to assign the token to
	 * @return {Bool}		Returns false if no spaces are available
	 */
	assignTokenToRandomSpace(token) {
		const space = this.randomFreeSpace();
		if (space) {
			this.assignTokenToSpace(token, space);
		}
	}

	isSpaceEmpty(space) {
		if (space.token === null) {
			return true;
		}
		return false;
	}

	doTokenValuesMatch(token1, token2) {
		if (token1.value === token2.value) {
			return true;
		}
		return false;
	}

	/**
	 * Check to see if there are no more moves to be made
	 **/
	isGameOver() {
		const gameOver = document.getElementById('game-over');
		const playArea = document.getElementById('play-area');

		if (this.gameOver === true) {
			playArea.style.opacity = 0.15;
			gameOver.style.display = 'block';
		}
	}

	/**
	 * Shift all Token objects into free spaces in the direction
	 * @param 	{string} 	direction 		Direction to move tokens (left, right, up, or down)
	 * @param 	{function} 	mergeCallback 	Callback for a merge function of the same direction
	 */
	move(direction, mergeCallback) {
		const space = this.board.spaces;
		let tokens = this.getAllTokens();

		if ('right' === direction || 'down' === direction) {
			tokens = tokens.reverse();
		}

		//Move tokens
		tokens.forEach((token) => {
			let targetSpace = null;

			for (let i = 0; i < this.board.columns; i++) {
				switch (direction) {
					case 'left':
						if (token.x - i >= 0) {
							//If the space to the left is empty, update the targetSpace
							if (this.isSpaceEmpty(space[token.x - i][token.y])) {
								targetSpace = space[token.x - i][token.y];
							}
						}
						break;
					case 'right':
						if (token.x + i <= 3) {
							//If the space to the right is empty, update the targetSpace
							if (this.isSpaceEmpty(space[token.x + i][token.y])) {
								targetSpace = space[token.x + i][token.y];
							}
						}
						break;
					case 'up':
						if (token.y - i >= 0) {
							//If the space above is empty, update the targetSpace
							if (this.isSpaceEmpty(space[token.x][token.y - i])) {
								targetSpace = space[token.x][token.y - i];
							}
						}
						break;
					case 'down':
						if (token.y + i <= 3) {
							//If the space below is empty, update the targetSpace
							if (this.isSpaceEmpty(space[token.x][token.y + i])) {
								targetSpace = space[token.x][token.y + i];
							}
						}
						break;
				}
			}

			//If we have a target space, move the token and assign it to the space
			if (targetSpace !== null) {
				space[token.x][token.y].token = null;
				this.assignTokenToSpace(token, targetSpace);
				token.move(targetSpace, direction);
				this.canMove = true;
			}
		});

		if (mergeCallback) {
			mergeCallback();
		}
	}

	/**
	 * Merge eligible tokes in the given direction
	 * @param 	{string} 	direction 		Direction to merge tokens (left, right, up, or down)
	 * @param 	{function} 	moveCallback 	Callback for a move function of the same direction
	 */
	merge(direction, moveCallback) {
		const space = this.board.spaces;
		let tokens = this.getAllTokens();
		const game = this;

		if ('right' === direction || 'down' === direction) {
			tokens = tokens.reverse();
		}

		//Merge tokens
		tokens.forEach((token) => {
			switch (direction) {
				case 'left':
					if (token.x - 1 >= 0) {
						const space1 = space[token.x][token.y];
						const space2 = space[token.x - 1][token.y];
						if (!game.isSpaceEmpty(space1) && !game.isSpaceEmpty(space2)) {
							if (game.doTokenValuesMatch(space1.token, space2.token)) {
								game.canMove = true;
								const newValue = space2.token.value * 2;
								space2.token.value = newValue;
								game.score += newValue;
								space2.token.redrawToken(newValue);
								space2.token.merge();
								space1.token.delete();
								space1.token = null;
							}
						}
					}
					break;
				case 'right':
					if (token.x + 1 <= 3) {
						const space1 = space[token.x][token.y];
						const space2 = space[token.x + 1][token.y];
						if (!game.isSpaceEmpty(space1) && !game.isSpaceEmpty(space2)) {
							if (game.doTokenValuesMatch(space1.token, space2.token)) {
								game.canMove = true;
								const newValue = space1.token.value * 2;
								space1.token.value = newValue;
								game.score += newValue;
								space1.token.redrawToken(newValue);
								space1.token.merge();
								space2.token.delete();
								space2.token = null;
							}
						}
					}
					break;
				case 'up':
					if (token.y - 1 >= 0) {
						const space1 = space[token.x][token.y];
						const space2 = space[token.x][token.y - 1];
						if (!game.isSpaceEmpty(space1) && !game.isSpaceEmpty(space2)) {
							if (game.doTokenValuesMatch(space1.token, space2.token)) {
								game.canMove = true;
								const newValue = space2.token.value * 2;
								space2.token.value = newValue;
								game.score += newValue;
								space2.token.redrawToken(newValue);
								space2.token.merge();
								space1.token.delete();
								space1.token = null;
							}
						}
					}
					break;
				case 'down':
					if (token.y + 1 <= 3) {
						const space1 = space[token.x][token.y];
						const space2 = space[token.x][token.y + 1];
						if (!game.isSpaceEmpty(space1) && !game.isSpaceEmpty(space2)) {
							if (game.doTokenValuesMatch(space1.token, space2.token)) {
								game.canMove = true;
								const newValue = space2.token.value * 2;
								space2.token.value = newValue;
								game.score += newValue;
								space2.token.redrawToken(newValue);
								space2.token.merge();
								space1.token.delete();
								space1.token = null;
							}
						}
					}
					break;
			}
		});
		if (moveCallback) {
			moveCallback();
		}
	}
}
