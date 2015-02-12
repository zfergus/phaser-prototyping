/*
 * State Class for booting the game
 * Created by Zachary Ferguson
 */

var BootState = function(){};
  
BootState.prototype = 
{	
	/* Load the load sprite */
	preload: function()
	{
          this.game.load.image("loading","assets/loading.png"); 
	},
	
	/* Create the load sprite */
  	create: function()
	{
		this.game.state.start("preload");
	}
};