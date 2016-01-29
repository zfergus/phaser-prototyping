/*
 * Digital 05: PlayState.js
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
		this.tilemap.setCollisionBetween(0, 100, true, this.finish);
		//this.game.physics.p2.convertTilemap(this.tilemap, this.cars);
		
		this.player = this.createPlayer(280, 0);
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		/* Created a Sprite that is fixed to the camera */
		var sprite = this.game.add.sprite(Math.floor(this.game.world.width/2),0);
		sprite.anchor.setTo(0.5, 0);
		sprite.fixedToCamera = true;

		/* addChild of my text at x:0, y:0 */
		this.beginTime = (new Date()).getTime();
		this.text = this.game.add.text(0, 0, "", {fill:"white", 
			font: "20px Courier", stroke: "black", strokeThickness: 2, 
			align: "center"});
		this.text.anchor.setTo(0.5, 0);
		sprite.addChild(this.text);
	},
	
	/* Creates the player sprite.                                        */
	/* Must give an int for the x and y coordinates for where the player */
	/* should be created.                                                */
	createPlayer: function(x, y)
	{
		/* Create the player sprite. */
		var player = this.game.add.sprite(x+20, y+80, "car");
		player.anchor.setTo(0.5, 1.0);
		
		/* Set the camera to follow the player */
		this.game.camera.follow(player);
		
		/* Create the smoke animation as a child sprite of the player. */
		player.smoke  = this.game.add.sprite(0, 10, "smoke");
		player.smoke.animations.add("puff", [0, 1, 2, 3], 8, true);
		player.smoke.animations.play("puff");
		player.smoke.anchor.setTo(0.5,1);
		player.smoke.alpha = 0;
		player.addChild(player.smoke);
		
		/* Create the car crash sound effect */
		player.crash_sfx = this.game.add.audio("crash");
		
		
		/* Enable physics on the player */
		this.game.physics.arcade.enable(player);
		
		/* Collide the player with the world bounds */
		//player.body.collideWorldBounds = true;
		
		/* Create base physics values for the player */
		player.acceleration = 200;
		player.maxSpeed = 500;
		player.drag = 100;
				
		/* Set the maximum Velocity */
		player.body.maxVelocity.setTo(player.maxSpeed, player.maxSpeed);
		/* Set the players drag */
		player.body.drag.setTo(player.drag+500, player.drag);
		
		/* Set the players acceleration */
		player.body.acceleration.x = 0;
		player.body.acceleration.y = player.acceleration;
		
		/* The number of crashes the player can survive */
		player.lives = 5;
		
		/* Crash the player. Decrements the lives and ends the game when */
		/* applicable.                                                   */
		player.hurt = function()
		{
			/* Play the car crash sound if not already */
			if(!(this.crash_sfx.isPlaying))
			{
				this.crash_sfx.play();
			}
			/* Decrement lives */
			this.lives--;
			/* Make the smoke more visible */
			this.smoke.alpha += 0.20;
			/* Check if the car is totalled, lives <= 0 */
			if(this.lives <= 0)
			{
				this.game.gameOverText = "GAME OVER\n\nYou totalled your car.\n\n" + 
										 "Press -> to continue";
				/* Pass the end y value so the background can be drawn */
				this.game.endY = this.game.camera.y;
				this.game.state.start("game over");
			}
		}
		
		/* Boolean for if the car is currently crashed */
		player.crashed = false;
		
		return player;
	},
	
	/* Update game every frame */
	update: function()
	{
		/* Update timer and score */
		this.updateText();
		
		/* Finish line win */
		if(this.player.y > this.game.world.height)
		{
			this.game.gameOverText = "Congratulations, You Win!\n\n\n\n" + 
									  "Press -> to play again";
			this.game.endY = this.game.camera.y;
			this.game.state.start("game over");
		}
		
		/* Collide Cars */
		this.game.physics.arcade.collide(this.cars, this.player);
		
		/* Damage the player if the car collides front on */
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
			this.player.body.velocity.x = 0;
		}
	},
	
	/* Updates the text to reflect the current time and damage of the player. */
	updateText: function()
	{		
		this.text.text = "Time: "+ 
			Math.floor(((new Date()).getTime() - this.beginTime)/1000.0)  + 
			"\nDamage: " + (5-this.player.lives)/.05;
	}
};