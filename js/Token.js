class Token {
	constructor(index, value = this.tokenStartingValue ) {
		this.id = `token-${index}`;
		this.value = value;
		this.color = this.tokenColor();
		this.x = null;
		this.y = null;
	}

	/** 
	 * Draws new HTML token.
	 */
	drawHTMLToken( x, y ) {
		const token = document.createElement( 'div' );
		document.getElementById( 'game-board-underlay' ).appendChild( token );
		token.setAttribute( 'id', this.id );
		token.setAttribute( 'class', 'token' );
		token.setAttribute( 'val', this.value );
		token.style.background = this.tokenColor();
		token.style.left = x * 76 + 37;
		token.style.top = y * 76 + 37;
		token.innerText = this.value;
		token.style.width = 1;
		token.style.height = 1;
		$( this.htmlToken ).animate( { 'height': 60, 'width': 60, 'left': x * 76,'top' : y * 76 }, 'easeOutBounce' );
	}

	/** 
	 * Updates token's value and background color
	 * @param 	{Num} 	Value to update innerText
	 */
	redrawToken( value, callback ) {
		const token = this.htmlToken;
		token.style.background = this.tokenColor();
		token.setAttribute( 'val', value );
		token.innerText = value;
		callback;
	}

	/** 
	 * Gets associated htmlToken.
	 * @return  {element}   Html element associated with token object.
	 */
	get htmlToken() {
		return document.getElementById( this.id );
	}

	/** 
	 * Gets a starting value for the token, either 2 or 4, at random
	 * @return  {int}   Value from array
	 */
	get tokenStartingValue() {
		const startingValues = [2,4];
		return startingValues[ Math.floor( ( Math.random() * startingValues.length ) ) ];
	}

	/** 
	 * Move the token to a given space in a given direction
	 * @param 	{Space}		Space object
	 * @param 	{string}	Direction to move (up, down, left, right)
	 */
	move( target, direction ) {
		let animation;
		switch ( direction ) {
			case 'left':
			case 'right':
				animation = { left: (target.x * 76) };
				break;
			case 'up':
			case 'down':
				animation = { top: (target.y * 76) };
				break;
		}
		$( this.htmlToken ).animate( animation, 250, 'easeOutBounce' );
	}

	/*
	 * Add a pulse animation when tokens merge
	 */
	merge() {
		const token = $( this.htmlToken );
		const timer = setTimeout( function() {
			token.removeClass( 'pulse' );
		}, 750 );
		token.addClass( 'pulse', timer );
	}

	/*
	 * Delete a duplicate token from the board
	 */
	delete() {
		this.htmlToken.parentElement.removeChild( this.htmlToken );
	}

	/*
	 * Set a token's color based on its value
	 */
	tokenColor() {
		switch ( this.value ) {
			case 4: return "#9bd668";
				break;
			case 8: return "#edcd1a";
				break;
			case 16: return "#c0caf7";
				break;
			case 32: return "#cc396c";
				break;
			case 64: return "#142f7a";
				break;
			case 128: return "#9bd668";
				break;
			case 256: return "#edcd1a";
				break;
			case 512: return "#c0caf7";
				break;
			case 1024: return "#cc396c";
				break;
			case 2048: return "#142f7a";
				break;
			case 4096: return "#9bd668";
				break;
			default: return "#142f7a";
		}
	}
}