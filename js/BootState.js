/*
 * State Class for booting the game
 * Created by Zachary Ferguson
 */

"use strict";
 
var BootState = function(){};
  
BootState.prototype = 
{	
	/* Load the load sprite */
	preload: function()
	{
          this.game.load.image("loading","assets/loading.png"); 
	},
	
	/* Create the load sprite */
  	create: function()
	{
		console.log("Boot");
		this.game.state.start("preload");
	}
};