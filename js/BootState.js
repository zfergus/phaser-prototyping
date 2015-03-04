/*
 * Digital N: BootState.js
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
		this.game.load.audio("mix", "assets/mix.ogg");
	},
	
	/* Move on to the preload state */
  	create: function()
	{
		console.log("Boot");
		
		var mix = this.game.add.audio("mix");
		mix.play();
		
		this.game.state.start("preload");
	}
};