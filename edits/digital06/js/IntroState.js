/*
 * SpaceSim: IntroState.js
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
		
		/* Create intro text */
		var introtext = "SpaceSim\n\n\
		You are a space ship pilot who has been trained by the ESP, Earth\n\
		Space Program, to fly the ESS, the most advanced solar explorer.\n\
		Your mission is to explore the solar system and claim the\n\
		celestial bodies within it for SCIENCE!\n\
		You have a deadly secret, however.\n\
		YOU NEVER LEARNED HOW TO USE THE AUTOMATED \n\
		LANDING COMPUTER!\
		\n\nPress -> to continue";
		this.text = this.game.add.text(400, 300, introtext,
			{fill:"white", font: "18px Courier", align: "center"});
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
			this.game.state.start("resources");
		}
	}
};