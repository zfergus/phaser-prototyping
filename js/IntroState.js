/*
 * Digital N: IntroState.js
 * Created by Zachary Ferguson
 * State Class for the introduction text
 */

"use strict";
 
function IntroState() {};

IntroState.prototype = 
{	
	/* Create the intro sprite */
	create: function()
	{
		console.log("Intro");
		
		/* Play the intro */
		
		this.game.add.sprite(0, 0, "title-screen");
		
		/* Create intro text */
		var introtext = "Escape the Maze";
		this.text = this.game.add.text(400, 300, introtext,
			{fill:"white", font: "36px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);
		
		/* Load controls */
		//this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.add.button(400, 450, "playB", 
			function()
			{
				//this.music.stop();
				this.game.state.start("play");
			}, this, 1, 1, 1, 1).anchor.setTo(0.5, 0.0)
	},
	
	/* Wait for control to continue */
	update: function()
	{
		/* On right arrow or pointer press */
		// if(this.cursors.right.isDown || this.game.input.activePointer.isDown)
		// {
			// this.game.state.start("play");
		// }
	}
};