/*
 * Digital 07: Blob.js
 * Created by Zachary Ferguson
 * The Blob class that inherits from the Phaser.Sprite class.
 */

"use strict";

function Blob(game, x, y)
{
	/* Create the blob sprite. */
	Phaser.Sprite.call(this, game, x, y, "blob");
	
	this.game.physics.arcade.enable(this);
	/* The default velocity of this blob. */
	this.DEFAULT_VELOCITY = 50;
	/* Center the anchor points. */
	this.anchor.setTo(0.5,0.5);
	/* Collide with the bounds. */
	this.body.collideWorldBounds = true;
	
	/* Create the sound effects. */
	this.movementSound = this.game.add.audio("slime_move");
	
	/* List of all blocks that have been absorbed by this blob. */
	this.absorbed_blocks = [];
	
	/* Pulse size */
	this.pulseDelta = 4;
}

/* Blobs are a type of Phaser.Sprite */
Blob.prototype = Object.create(Phaser.Sprite.prototype);
Blob.prototype.constructor = Blob;

Blob.prototype.moveAbsorbed = function()
{
	for(var i = 0; i < this.absorbed_blocks.length; i++)
	{
		var block = this.absorbed_blocks[i];
		block.x = (this.x-this.width/2) + block.blobX;
		block.y = (this.y-this.height/2) + block.blobY;
	}
}

Blob.prototype.move = function()
{
	/* Reset the velocity. */
	this.body.velocity.setTo(0,0);
	
	/* If the left key is down move left. */
	if(this.game.cursors.left.isDown)
	{
		this.body.velocity.x = -this.DEFAULT_VELOCITY;
	}
	/* If the right key is down move right. */
	else if(this.game.cursors.right.isDown)
	{
		this.body.velocity.x = this.DEFAULT_VELOCITY;
	}
	/* If the up key is down move up. */
	else if(this.game.cursors.up.isDown)
	{
		this.body.velocity.y = -this.DEFAULT_VELOCITY;
	}
	/* If the down key is down move down. */
	else if(this.game.cursors.down.isDown)
	{
		this.body.velocity.y = this.DEFAULT_VELOCITY;
	}

	if(this.body.velocity.x > 0 || this.body.velocity.y > 0)
	{
		if(!(this.movementSound.isPlaying))
			this.movementSound.play();
	}
	else
	{
		this.movementSound.stop();
	}
	
	/* Move all of the absorbed blocks. */
	this.moveAbsorbed();
}

Blob.prototype.absorb = function(this_blob, block)
{
	if(!(block.absurbed) && block.width < this.width && 
		block.height < this.height)
	{
		/* Turn of the collisions with the block. */
		block.alive = false;
		/* Add the block to the list of absorbed blocks. */
		this.absorbed_blocks[this.absorbed_blocks.length] = block;
		//this.addChild(block);
		block.absurbed = true;
		/* Calculate a random relative x and y for the block. */
		block.blobX = Math.floor(Math.random() * (this.width-block.width-20)+20);
		block.blobY = Math.floor(Math.random() * (this.height-block.height-20)+20);

		/* Increase the blobs size. */
		this.width += block.width/4;
		this.height += block.height/4;
	}
}

Blob.prototype.pulse = function()
{
	this.width += this.pulseDelta;
	this.height += this.pulseDelta;
	this.pulseDelta = -1*this.pulseDelta;
}