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
		this.blocks = this.game.add.group(this.game.world, "blocks", false, 
			true);
		this.blocks.enableBody = true;
		this.createBlocks(24);
		//this.blocks.moveDown();
		
		/* Create the blob. */
		this.blob = this.game.add.existing(new Blob(this.game, 
			this.game.world.width/2, 
			this.game.world.height/2));
		/* Put the blob over other sprites. */
		this.blob.bringToTop();

		/* Load controls */
		this.game.cursors = this.game.input.keyboard.createCursorKeys();
		
		/* Get the time. */
		this.previousTime = (new Date()).getTime();
		this.startTime = this.previousTime;
		
		var levelText = this.game.add.text(this.game.world.width/2, 
			this.game.world.height/2, "Level " + (this.game.level+1),
			{fill:"white", font: "36px Courier", align: "center"});
		levelText.anchor.setTo(0.5,0.5);
		levelText.bringToTop();
		this.game.time.events.add(1000, function() 
			{
				this.game.add.tween(levelText).to({alpha: 0}, 1000, 
					Phaser.Easing.Linear.None, true);
			}, this);
		
		this.timer = this.game.add.text(this.game.world.width-160, 
			this.game.world.height-32, "Time: " + 
			((new Date()).getTime() - this.startTime)/1000, 
			{fill:"white", font: "20px Courier", align: "center"});
		this.score = this.game.add.text(10, this.game.world.height-32, 
			"Score: "+this.game.score,
			{fill:"white", font: "20px Courier", align: "center"});
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
			/* Create a random scale for the blocks. */
			var scale = eval(this.game.levelVals[this.game.level]);
			block.scale.setTo(scale, scale);
			
			block.body.collideWorldBounds = true;
			block.body.immovable = true;
			
			block.absurbed = false;
		}
	},
	
	/* Update game every frame */
	update: function()
	{
		/* If the player collects all of the blocks */
		if(this.blob.absorbed_blocks.length >= this.blocks.length)
		{
			this.game.level++;
			if(this.game.level < this.game.levelVals.length)
			{
				this.game.state.start("play");
			}
			else
			{
				this.game.overText = "Congratulations, You Won!";
				this.game.state.start("game over");
			}
		}
		
		/* If the time runs out and the game is over. */
		if(((new Date()).getTime() - this.startTime)/1000 >= 60.0)
		{
			this.game.overText = "GAME OVER";
			this.game.state.start("game over");
		}
		
		/* If the blob collides with a block. */
		this.game.physics.arcade.collide(this.blob, this.blocks, 
			this.blob.absorb,null, this.blob);
		/* If the blob grew enough to overlap with a block. */
		this.game.physics.arcade.overlap(this.blob, this.blocks, 
			this.blob.absorb,null, this.blob);
		
		/* Move the blob around the world */
		this.blob.move();
		
		/* Pulse the blob. */
		if((new Date()).getTime() >= this.previousTime + 500)
		{
			this.blob.pulse();
			this.previousTime = (new Date()).getTime();
		}
		
		/* Update the text. */
		this.updateTime();
		this.updateScore();
 	},
	
	/* Update the timer text. */
	updateTime: function()
	{
		this.timer.text = "Time: " + ("%.2f",(60.0 + ((this.startTime - 
			(new Date()).getTime())/1000))).toFixed(2);
		this.timer.bringToTop();
	},
	
	/* Update the score text. */
	updateScore: function()
	{
		this.score.text = "Score: " + this.game.score;
		this.timer.bringToTop();
	}
};