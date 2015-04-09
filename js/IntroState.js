/*
 * Digital 08: IntroState.js
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
		this.game.stage.backgroundColor = 0x1a1c1a;		
		/* Play the intro */
		
		/* Create intro text */
		var introtext = "High Sea Cannons\n\n\n\nClick to play";
		this.text = this.game.add.text(400, 300, introtext,
			{fill:"white", font: "36px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
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