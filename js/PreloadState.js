/*
 * SpaceSim: PreloadState.js
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
		this.game.load.image("ship", "assets/rocket.png");
		this.game.load.image("burn", "assets/burn.png");
		this.game.load.image("SolarMapShip", "assets/SolarMapShip.png");
		this.game.load.image("SolarMapBurn", "assets/SolarMapBurn.png");
		this.game.load.image("sky", "assets/earth_sky.png");
		this.game.load.image("ground", "assets/earth_ground.png");
		
		/* Load sprites */
		this.game.load.spritesheet("exhaust", "assets/exhaust.png", 10, 10);
		this.game.load.spritesheet("explosion", "assets/explosion.png", 64, 64);
		this.game.load.spritesheet("celestial bodies", 
			"assets/celestial-bodies.png", 80, 80);
				
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