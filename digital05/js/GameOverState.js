/*
 * Digital 05: GameOverState.js
 * Created by Zachary Ferguson
 * Game State Class for displaying the Game Over screen and the player's score
 */

"use strict";
 
function GameOverState() {};

GameOverState.prototype = 
{	
	/* Create the intro sprite */
	create: function()
	{
		console.log("Game Over");
		
		/* Reset the background color to black */
		this.game.add.image(0, -this.game.endY, "end-bg");
		
		/* Create the Game Over text with the score */
		var gameovertext = this.game.gameOverText;
		this.text = this.game.add.text(400, 300, gameovertext,
			{fill:"white", stroke: "black", strokeThickness: 2, 
			font: "36px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);

		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	
	/* Wait for control to continue to intro state */
	update: function()
	{
		/* On right arrow or pointer press */
		if(this.cursors.right.isDown || this.game.input.activePointer.isDown)
		{
			this.game.state.start("intro");
		}
	}
	
	
};