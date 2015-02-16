/*
 * State Class for preloading game assets
 * Created by Zachary Ferguson
 */

"use strict";
 
function PreloadState() {};

PreloadState.prototype = 
{
	/* Load assets */
	preload: function()
	{ 
		var loadingBar = this.add.sprite(400,300,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);
		  
		/* Load tile map */

		/* Load images */

		/* Load sprites */

		
		/* Load Sounds */

	},
	
	/* Play the intro */
	create: function()
	{
		this.game.state.start("intro");
	}
};