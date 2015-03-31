/*
 * Digital 07: BootState.js
 * Created by Zachary Ferguson
 * Game State Class for booting the main game
 */

"use strict";
 
var BootState = function(){};
  
BootState.prototype = 
{	
	/* Load the loading sprite */
	preload: function()
	{
        this.game.load.image("loading","assets/loading.png"); 
	},
	
	/* Move on to the preload state */
  	create: function()
	{
		console.log("Boot");
		this.game.state.start("preload");
	}
};