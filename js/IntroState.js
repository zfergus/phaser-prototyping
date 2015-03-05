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
		/** Play the intro **/		
		
		/* Create Background */
		this.game.add.image(0, 0, "intro-bg");
		
		/* Create intro text */
		var introtext = "\"Ugh...another traffic jam,\n" +
			"and I just got this new sports car.\n"+
			"Time to make my own route.\"\n\n"+
			"Speed through traffic avoiding\n"+
			"collisions.\n\n"+
			"Press -> to continue";
		this.text = this.game.add.text(400, 300, introtext,
			{fill:"white", stroke: "black", strokeThickness: 2, 
			font: "36px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	
	/* Wait for control to continue */
	update: function()
	{
		/* On right arrow or pointer press */
		if(this.cursors.right.isDown || this.game.input.activePointer.isDown)
		{
			this.game.state.start("play");
		}
	}
};