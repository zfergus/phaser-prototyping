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
		this.game.load.spritesheet("bullet", "assets/bullet.png");
		
		/* Load sprites */
		this.game.load.spritesheet("zombie", "assets/zombie.png", 42, 42);
		this.game.load.spritesheet("fighter", "assets/fighter.png", 42, 42);
		this.game.load.spritesheet("civilian", "assets/civilian.png", 42, 42);
		this.game.load.spritesheet("health", "assets/health.png", 40, 10);
		this.game.load.spritesheet("blood", "assets/blood.png", 10, 20);
		this.game.load.spritesheet("blood2", "assets/blood2.png", 20, 20);
		
		/* Load Sounds */
		this.game.load.audio("gunshot", "assets/gunshot.ogg");
		this.game.load.audio("attack", "assets/attack.ogg");
		this.game.load.audio("music", "assets/music.ogg");
		this.game.load.audio("car_sound", "assets/car.ogg");
		
	},
	
	/* Play the intro state */
	create: function()
	{
		console.log("Preload");
		
		/* Play the background music */
		this.game.add.audio("music", .5, true).play();
		
		this.game.state.start("intro");
	}
};