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
		this.text = this.game.add.text(400, 300, "This is the intro text for\n\nThe Last Elemental\n\nPress -> to continue.", 
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
			this.game.state.start("play");
		}
	}
};