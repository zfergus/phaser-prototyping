/*
 * Digital N: GameOverState.js
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
		this.game.stage.backgroundColor = 0x000000;
		
		/* Create the Game Over text with the score */
		//var gameovertext = "GAME OVER\n\n\n\nPress to continue";
		var gameovertext = this.game.game_over_text;
		this.text = this.game.add.text(400, 300, gameovertext, 
			{fill:"white", font: "36px Courier", align: "center"});
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