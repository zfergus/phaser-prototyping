/*
 * State Class for the kill screen
 * Created by Zachary Ferguson
 */

"use strict";
 
function GameOverState() {};

GameOverState.prototype = 
{	
	/* Create the intro sprite */
	create: function()
	{
		this.game.stage.backgroundColor = 0x000000;
		console.log("Game Over");
		/* Play the intro */
		
		/* Create text */
		var gameovertext = "GAME OVER\n\nScore: " + this.game.score + 
						   "\n\nPress to continue"
		this.text = this.game.add.text(400, 300, gameovertext, 
		{fill:"white", font: "36px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);
		
		/* Play the background music */
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	
	/* Wait for control to continue */
	update: function()
	{
		if(this.cursors.right.isDown || this.game.input.activePointer.isDown)
		{
			this.game.state.start("intro");
		}
	}
	
	
};