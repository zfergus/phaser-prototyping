/*
 * Digital 10: PreloadState.js
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
		this.game.load.image("tileset", "assets/tileset.png");
		this.game.load.tilemap("maze", "assets/maze.json", null, 
			Phaser.Tilemap.TILED_JSON);
		
		/* Load images */
		this.game.load.image("key", "assets/key.png");
		this.game.load.image("title-screen", "assets/title-screen.png");
		this.game.load.image("playB", "assets/playB.png");
		
		/* Load sprites */
		this.game.load.spritesheet("player", "assets/player.png", 40, 40);
		this.game.load.spritesheet("blade", "assets/blade.png", 40, 40);
		
		/* Load Sounds */
		this.game.load.audio("hurt", "assets/hurt.wav");
		this.game.load.audio("pickup", "assets/pickup.wav");
		this.game.load.audio("bg-music", "assets/music.ogg");
		
		this.music = this.game.add.sound("bg-music", 1, true);
		this.music.play();
	},
	
	/* Play the intro state */
	create: function()
	{
		console.log("Preload");
		
		/* Play the background music */
		
		this.game.state.start("intro");
	}
};