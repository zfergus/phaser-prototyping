var BootState = function(){};
  
BootState.prototype = {
	preload: function()
	{
          this.game.load.image("loading","assets/loading.png"); 
	},
	
  	create: function()
	{
		this.game.state.start("preload");
	}
};