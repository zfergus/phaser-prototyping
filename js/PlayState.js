/*
 * Digital 07: PlayState.js
 * Created by Zachary Ferguson
 * Game State Class for playing the main game
 */

"use strict";
 
function PlayState() {};

PlayState.prototype = 
{	
	/* Create the tilemap, player, and groups */
	create: function()
	{
		console.log("Play");
		
		/* Set the background to grey. */
		this.game.stage.backgroundColor = 0x404040;
		
		/* Create the blocks. */
		this.blocks = this.game.add.group("blocks", false, true);
		this.blocks.enableBody = true;
		this.createBlocks(24);
		
		/* Create the blob. */
		this.blob = this.game.add.existing(new Blob(this.game, 
			this.game.world.width/2, 
			this.game.world.height/2));
		/* Put the blob over other sprites. */
		this.game.world.bringToTop(this.blob);
		
		/* Load controls */
		this.game.cursors = this.game.input.keyboard.createCursorKeys();
		
		/* Get the time. */
		this.previousTime = (new Date()).getTime();
	},
	
	/* Creates n new blocks at random positions. */
	createBlocks: function(n)
	{
		/* Create n blocks. */
		for(var i = 0; i < n; i++)
		{
			/* Determine the random coordinates. */
			var x = Math.floor((this.game.world.width-80) * Math.random());
			var y = Math.floor((this.game.world.height-80) * Math.random());
			
			var block = this.blocks.create(x, y, "blocks");
			/* Set the blocks type. */
			block.frame = Math.floor(Math.random() * 16);
			/* Create a random scale in the range [0.125, 3). */
			var scale = (Math.random() * 3.0) + 0.125;
			block.scale.setTo(scale, scale);
			
			block.body.collideWorldBounds = true;
			block.body.immovable = true;
			
			block.absurbed = false;
		}
	},
	
	/* Update game every frame */
	update: function()
	{
		this.game.physics.arcade.collide(this.blob, this.blocks, 
			this.blob.absorb,null, this.blob);
		
		this.blob.move();
		
		if((new Date()).getTime() >= this.previousTime + 500)
		{
			this.blob.pulse();
			this.previousTime = (new Date()).getTime();
		}
 	}
};