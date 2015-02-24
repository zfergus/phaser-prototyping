/*
 * Digital 03: PreloadState.js
 * Created by Zachary Ferguson
 * Game State Class for preloading game assets
 */

"use strict";
 
function PreloadState() {};

PreloadState.prototype = 
{
	/* Load assets */
	preload: function()
	{ 
		/* Set-up the loading bar */
		var loadingBar = this.add.sprite(400,300,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);
		  
		/* Load tile map */
		
		/* Load images */
		this.game.load.image("road", "assets/road.png");
		this.game.load.spritesheet("car", "assets/car.png");
		
		/* Load sprites */
		this.game.load.spritesheet("zombie", "assets/zombie.png", 42, 42);
		this.game.load.spritesheet("fighter", "assets/fighter.png", 42, 42);
		
		/* Load Sounds */
		
	},
	
	/* Play the intro state */
	create: function()
	{
		console.log("Preload");
		
		/* Play the background music */
		
		this.game.state.start("intro");
	}
};