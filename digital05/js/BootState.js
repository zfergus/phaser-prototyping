/*
 * Digital 05: BootState.js
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
		
		/* Load the intro sounds */
		this.game.load.audio("mix", "assets/mix.ogg");
		this.game.load.audio("music", "assets/music.ogg");
	},
	
	/* Move on to the preload state */
  	create: function()
	{
		console.log("Boot");
		
		var mix = this.game.add.audio("mix");
		mix.play();
		
		var music = this.game.add.audio("music");
		music.play("", 0, 1, true);
		
		this.game.state.start("preload");
	}
};