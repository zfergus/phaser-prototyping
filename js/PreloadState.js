/*
 * Digital 07: PreloadState.js
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
		this.game.load.image("blob", "assets/blob.png");
		
		/* Load sprites */
		this.game.load.spritesheet("blocks", "assets/blocks.png", 40, 40);
		
		/* Load Sounds */
		this.game.load.audio("slime_move", "assets/slime_movement.ogg");
	},
	
	/* Play the intro state */
	create: function()
	{
		console.log("Preload");
		
		/* Play the background music */
		
		this.game.state.start("intro");
	}
};