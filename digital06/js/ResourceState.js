/*
 * SpaceSim: ResourceState.js
 * Created by Zachary Ferguson
 * State Class for getting the player choice of resources
 */

"use strict";
 
function ResourceState() {};

ResourceState.prototype = 
{	
	/* Create the intro sprite */
	create: function()
	{
		console.log("ResourceState");
		/* Play the intro */
		
		/* Create question text */
		this.text = this.game.add.text(400, 80, "Initial amount of fuel?",
			{fill:"white", font: "18px Courier", align: "center"});
		/* Center text */
		this.text.anchor.setTo(0.5,0.5);
		
		this.game.add.button(400, 100, "buttons", 
			function()
			{
				this.game.initialFuel = 500;
				this.game.state.start("play");
			}, this, 0, 0, 0, 0).anchor.setTo(0.5, 0.0)
			
		this.game.add.button(400, 300, "buttons", 
			function()
			{
				this.game.initialFuel = 1000;
				this.game.state.start("play");
			}, this, 1, 1, 1, 1).anchor.setTo(0.5, 0.0)
			
		this.game.add.button(400, 500, "buttons", 
			function()
			{
				this.game.initialFuel = 2500;
				this.game.state.start("play");
			}, this, 2, 2, 2, 2).anchor.setTo(0.5, 0.0)
	},
	
	/* Wait for the button presses */
	update: function(){}
};