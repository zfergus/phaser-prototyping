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
		this.game.stage.backgroundColor = 0x404040;
		
		this.blocks = this.game.add.group("blocks", false, true);
		this.blocks.enableBody = true;
		for(var i = 0; i < 24; i++)
		{
			var x = Math.floor((this.game.world.width-80) * Math.random());
			var y = Math.floor((this.game.world.height-80) * Math.random());
			var block = this.blocks.create(x, y, "blocks");
			block.frame = Math.floor(Math.random() * 16);
			var scale = Math.random() * 2 + 0.125;
			block.scale.setTo(scale, scale);
			block.body.collideWorldBounds = true;
			block.absurbed = false;
			block.body.immovable = true;
		}
		console.log(this.blocks);
		this.blob = this.game.add.sprite(this.game.world.width/2, 
			this.game.world.height/2, "blob");
		//this.blob.alpha = 0.75
		this.game.physics.arcade.enable(this.blob);
		this.blob.body.maxVelocity.x = 100;
		this.blob.body.maxVelocity.y = 100;
		this.blob.DEFAULT_VELOCITY = 50;
		this.blob.anchor.setTo(0.5,0.5);
		this.blob.body.collideWorldBounds = true;
		this.blob_movementSound = this.game.add.audio("slime_move");
		this.game.world.bringToTop(this.blob);
		this.blob.absorbed_blocks = [];
		this.blob.moveAbsorbed = function()
		{
			for(var i = 0; i < this.absorbed_blocks.length; i++)
			{
				var block = this.absorbed_blocks[i];
				block.x = (this.x-this.width/2) + block.blobX;
				block.y = (this.y-this.height/2) + block.blobY;
			}
		}
		console.log(this.blob);
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.delta = 4;
		this.previousTime = (new Date()).getTime();
	},
	
	/* Update game every frame */
	update: function()
	{
		this.game.physics.arcade.collide(this.blob, this.blocks, 
			function(blob, block)
			{
				if(!(block.absurbed) && block.width < blob.width && 
					block.height < blob.height)
				{
					block.alive = false;
					blob.absorbed_blocks[blob.absorbed_blocks.length] = block;
					block.absurbed = true;
					block.blobX = Math.floor(Math.random() * (blob.width-
						block.width));
					block.blobY = Math.floor(Math.random() * (blob.height-
						block.height));
					//block.kill();
					this.blob.width += block.width/4;
					this.blob.height += block.height/4;
				}
			},null, this);

		this.blob.moveAbsorbed();
		
		var angledX = false;
		if(this.cursors.left.isDown)
		{
			this.blob.body.velocity.x = -this.blob.DEFAULT_VELOCITY;
			angledX = true;
		}
		else if(this.cursors.right.isDown)
		{
			this.blob.body.velocity.x = this.blob.DEFAULT_VELOCITY;
			angledX = true;
		}
		else
		{
			this.blob.body.velocity.x = 0;
		}
		
		var angledY = false;
		if(this.cursors.up.isDown)
		{
			this.blob.body.velocity.y = -this.blob.DEFAULT_VELOCITY;
			angledY = true;
		}
		else if(this.cursors.down.isDown)
		{
			this.blob.body.velocity.y = this.blob.DEFAULT_VELOCITY;
			angledY = true;
		}
		else
		{
			this.blob.body.velocity.y = 0;
		}
		
		/* Rotate the blob correctly */
		if(angledX && angledY)
		{
			this.blob.rotation = Math.PI/4.0;
		}
		else
		{
			this.blob.rotation = 0;
		}
		
		if(angledX || angledY)
		{
			if(!(this.blob_movementSound.isPlaying))
				this.blob_movementSound.play();
		}
		else
		{
			this.blob_movementSound.stop();
		}
		
		//console.log((new Date()).getTime());
		if((new Date()).getTime() >= this.previousTime + 500)
		{
			this.blob.width += this.delta;
			this.blob.height += this.delta;
			this.delta = -this.delta;
			this.previousTime = (new Date()).getTime();
		}
 	}
};