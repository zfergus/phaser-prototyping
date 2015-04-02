/*
 * Digital 07: IntroState.js
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
		
		this.game.stage.backgroundColor = 0x404040;
		
		/* Create intro text */
		var introtext = "Move around to absorb blocks\n\
			and grow.\n\n\n\n\
			Press -> to continue.";
		this.text = this.game.add.text(400, 300, introtext,
			{fill:"white", font: "24px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.game.levelVals = ["(Math.random() * 3.0) + 0.125", 
			"(i/24 * 3.0) + 0.125", "(1/(i+1) * 3.0) + 0.125"];
		this.game.level = 0;
		this.game.score = 0;
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