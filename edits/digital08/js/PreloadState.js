/*
 * Digital 08: PreloadState.js
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
		this.game.load.image("cannon-ball", "assets/cannon-ball.png");
		this.game.load.image("land", "assets/land.png");
		this.game.load.image("startB", "assets/start_button.png");
		
		/* Load sprites */
		this.game.load.spritesheet("ship", "assets/ships.png", 32, 32);
		
		/* Load Sounds */
		this.game.load.audio("cannon-shot", "assets/cannon-shot.ogg");
	},
	
	/* Play the intro state */
	create: function()
	{
		console.log("Preload");
		
		/* Play the background music */
		
		this.game.state.start("intro");
	}
};