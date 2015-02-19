/*
 * Digital 03: PlayState.js
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
		
		/* Increase the bounds to allow for the camera shake */
		this.game.world.setBounds(-10, -10, this.game.width + 20, 
			this.game.height + 20);
		
		this.game.stage.backgroundColor = 0x142849;
		this.game.add.image(0,0,"sky");
		
		this.startTime = (new Date()).getTime();
		
		/* Create tile map */
		this.tilemap = this.game.add.tilemap("world");
		this.tilemap.addTilesetImage("tileset", "tileset");
		this.ground = this.tilemap.createLayer("ground");
		this.wall   = this.tilemap.createLayer(  "wall");
		/* Set collisions */
		this.tilemap.setCollision(1, true, this.ground);
		this.tilemap.setCollision(2, true, this.wall);
		
		/** Create sprites and groups **/
		
		this.player = this.game.add.sprite(46, this.game.camera.height-172, 
			"player", 8);

		this.meteors = this.game.add.group();
		this.meteors.enableBody = true;
		
		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		this.create_enemy();
		this.enemiesKilled = 0;
		this.killed = this.game.add.text(800-200, 20, "Enemies Killed: "+
			this.enemiesKilled,{fill:"white", font: "16px Courier", 
			align: "center"});
		
		this.attackCount = 16;
		this.count = this.game.add.text(20, 20, "Spell Count: "+this.attackCount,
			{fill:"white", font: "16px Courier", align: "center"});
			
		this.game.input.onTap.add(this.attack, this);
		
		/* Create sound effects */
		this.attack_audio = this.game.add.audio("fireball", 1, false);
		this.explosion_audio = this.game.add.audio("explosion", .05, false);
	},
	
	/* Update game every frame */
	update: function()
	{
		/** Check for collisions **/
		
		/* Loop through collision check until no exceptions thrown */
		var passed = false
		while(!passed)
		{
			try
			{
				/* Kill the enemy if the enemy is hit by meteor */
				this.game.physics.arcade.collide(this.meteors, this.enemies, 
					this.meteorStrike, this.checkAlive, this);
				passed = true;
			}
			catch(err)
			{
				//console.log("err");
			}
		}
			
		/* End game if the enemy reaches the player */
		if(this.game.physics.arcade.collide(this.enemies, this.wall))		
		{
			/* Update the player's score to the number of enemy kills */
			this.game.score = this.enemiesKilled;
			this.game.state.start("game over");
		}
		
		/* Get the current time in ms */
		var currentTime = (new Date()).getTime();
		
		/* Increase spell points every two seconds */
		this.attackCount += (currentTime%2000<20 && this.attackCount<16) ? 1:0;
		/* Change color if attackCount == 0 */
		this.count.fill = (this.attackCount===0) ? "red":"white";
		/* Update the attack and kill count texts */
		this.count.text  = "Attack Count: "   + this.attackCount;
		this.killed.text = "Enemies Killed: " + this.enemiesKilled;
		
		/* Spawn new enemies */
		if(currentTime - this.startTime > (8000/((this.enemiesKilled%16)+1)) && 
			this.enemies.length < 16)
		{
			this.create_enemy();
			this.startTime = currentTime;
		}
	},
	
	/* Creates an enemy right of the world */
	create_enemy: function()
	{
		var enemy = this.enemies.create(this.game.world.width+1, 
			this.game.camera.height-92, "enemy");
		/* Add walk left animation */
		enemy.animations.add( "left", [ 4,  5,  6,  7], 5, true);
		
		/* Start moving to the left */
		enemy.body.velocity.x = -128 - (32 * Math.floor(this.enemiesKilled/16));
		enemy.animations.play("left");
	},
	
	/* Cast a spell towards the pointer */
	attack: function()
	{
		/* Check for enough attack power */
		if(this.attackCount <= 0) return;

		/* Create a meteor at a random x value */
		var meteor = this.meteors.create(Math.random()*800, 0, "meteor");
		
		/* Spin animation */
		meteor.animations.add("spin", [0, 1], 10, true);
		meteor.animations.play("spin");
		
		/** Compute XY Velocity from the magnitude and angle **/
		/* Compute angle */
		var theta = this.game.physics.arcade.angleToPointer(meteor);
		/* Compute components of the velocity */
		meteor.body.velocity.x = Math.cos(theta) * 1000;
		meteor.body.velocity.y = Math.sin(theta) * 1000;
		
		/* Kill the meteor outside of the world */
		meteor.checkWorldBounds = true;
		meteor.outOfBoundsKill = true;
		
		/* Play attack_audio if not already */
		if(!this.attack_audio.isPlaying)
			this.attack_audio.play();
		
		/* Decrement the attack count */
		this.attackCount--;
	},
	
	/* Function for colliding a meteor with a enemy.      */
	/* Must be given the meteor and enemy to collide.     */
	/* Destroys both parameters and creates an explosion. */
	meteorStrike: function(meteor, enemy)
	{
		/* Remove the enemy */
		this.enemies.remove(enemy, true);
		
		/* Create an explosion */
		var explosion = this.game.add.sprite(meteor.x, 504, "explosion");
		explosion.animations.add("explode", [0,1,2,3,4,5,6,7], 32, false);
		explosion.animations.play("explode", 32, false, true);
		if(!this.explosion_audio.isPlaying)
			this.explosion_audio.play();
		
		/* Remove the meteor */
		this.meteors.remove(meteor, true);
		
		/* Increment the kill count/score */
		this.enemiesKilled++;
		
		/* Shake the camera if not on a mobile device. */
		/* Shake can break slower mobile browsers.     */
		if(!this.mobilecheck())
		{
			this.game.camera.y = 0;
			this.game.add.tween(this.game.camera)
				.to({ y: -10 }, 10, Phaser.Easing.Sinusoidal.InOut, false, 0, 5,
					true)
				.start();
		}
	},
	
	/* Checks if the game is being played on a mobile device.      */
	/* Returns a boolean for if the browser is on a mobile device. */
	mobilecheck: function()
	{
		var check = false;
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
		{
			check = true;
		}		
		return check;
	}
};