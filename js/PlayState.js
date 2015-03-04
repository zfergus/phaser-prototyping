/*
 * Digital N: PlayState.js
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
		
		this.game.world.setBounds(0, 0, 800, 9600);
		
		//this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.game.add.image(0,0,"road");
		
		/* Create tile map */
		this.tilemap = this.game.add.tilemap("traffic");
		this.tilemap.addTilesetImage("car_tileset", "car_tileset");
		this.tilemap.addTilesetImage("road", "road");
		this.background = this.tilemap.createLayer("road");
		this.cars = this.tilemap.createLayer("cars");
		this.finish = this.tilemap.createLayer("finish");
		/* Set collisions */
		this.tilemap.setCollision([0,1,2,3,4], true, this.cars);
		//this.game.physics.p2.convertTilemap(this.tilemap, this.cars);
		
		this.player = this.createPlayer(280, 0);
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	
	createPlayer: function(x, y)
	{
		/* The player and its settings */
		var player = this.game.add.sprite(x+20, y-40, "car");

		/* Enable physics on the player */
		this.game.physics.arcade.enable(player);
		
		player.anchor.setTo(0.5, 1.0);
		
		/* Player physics properties. Give the little guy a slight bounce. */
		player.body.collideWorldBounds = true;
		
		this.game.camera.follow(player);
		
		/* Create a base speed for the player */
		player.acceleration = 200;
		player.maxSpeed = 500;
		player.drag = 100;
		player.lives = 5;
		
		player.body.maxVelocity.setTo(player.maxSpeed, player.maxSpeed);
		player.body.drag.setTo(player.drag+500, player.drag);
		
		player.body.acceleration.x = 0;
		player.body.acceleration.y = player.acceleration;
		
		player.hurt = function()
		{
			player.lives -= 1;
			if(player.lives <= 0)
			{
				this.game.gameOverText = "GAME OVER\n\n\n\nPress to continue";
				this.game.state.start("game over");
			}
		}
		
		player.crashed = false;
		
		return player;
	},
	
	/* Update game every frame */
	update: function()
	{
		/* Collide Cars */
		this.game.physics.arcade.collide(this.cars, this.player);
		
		//console.log(this.player.lives + " " + this.player.body.touching.down + 
		//	" " + this.player.body.blocked.down);
		
		if(this.player.body.blocked.down)
		{
			if(!this.player.crashed)
			{
				this.player.hurt();
				this.player.crashed = true;
			}
		}
		else
		{
			this.player.crashed = false;
		}
		
		/* Check for cursors that are down */
		if(this.cursors.left.isDown)
		{
			this.player.body.velocity.x = -200;
		}
		else if(this.cursors.right.isDown)
		{
			this.player.body.velocity.x = 200;
		}
		else
		{
			//this.player.body.acceleration.x = 0;
			this.player.body.velocity.x = 0;
		}
	}
};