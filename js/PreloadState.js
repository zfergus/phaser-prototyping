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
		this.game.load.image("car_tileset", "assets/car_tileset.png");
		this.game.load.tilemap("traffic", "assets/traffic.json", null, 
			Phaser.Tilemap.TILED_JSON);
		
		/* Load images */
		this.game.load.image("road", "assets/road.png");
		this.game.load.image("car", "assets/car.png");
		this.game.load.spritesheet("smoke", "assets/smoke-sheet.png", 40, 80);
		this.game.load.image("intro-bg", "assets/intro.png");
		this.game.load.image("end-bg", "assets/traffic.png");
		
		/* Load sprites */
		
		/* Load Sounds */
		this.game.load.audio("crash", "assets/crash.ogg");
	},
	
	/* Play the intro state */
	create: function()
	{
		console.log("Preload");
		
		/* Play the background music */
		
		this.game.state.start("intro");
	}
};