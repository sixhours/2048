class Board {
	constructor() {
		this.rows = 4;
		this.columns = 4;
		this.spaces = this.getSpaces();
	}

	/**
	 * Generates 2D array of spaces in columns.
	 * @return  {Array}     An array of space objects
	 */
	getSpaces() {
		const spaces = [];
		for (let x = 0; x < this.columns; x++) {
			const column = [];
			for (let y = 0; y < this.rows; y++) {
				let space = new Space(x, y);
				column.push(space);
			}
			spaces.push(column);
		}
		return spaces;
	}

	/**
	 * Renders the 2D array of Space objects.
	 */
	drawHTMLBoard() {
		for (let column of this.spaces) {
			for (let space of column) {
				space.drawSVGSpace();
			}
		}
	}

	/**
	 * Get the score box
	 */
	get scoreBox() {
		return document.getElementById('game-score');
	}
}
