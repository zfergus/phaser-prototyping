/*
 * State Class for the introduction text
 * Created by Zachary Ferguson
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
		
		/* Create text */
		var introtext = "You are the last elemental\n"+
						"sorcerer. Defend your self against\n"+
						"the oncoming waves of enemies.\n\n\n\n"+
						"Click to continue"
		this.text = this.game.add.text(400, 300, introtext,
		{fill:"white", font: "36px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);
		
		/* Play the background music */
		this.game.add.audio("music", .05, true).play();
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	
	/* Wait for control to continue */
	update: function()
	{
		if(this.cursors.right.isDown || this.game.input.activePointer.isDown)
		{
			this.game.state.start("play");
		}
	}
};