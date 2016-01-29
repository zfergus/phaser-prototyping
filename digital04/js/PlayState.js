/*
 * Digital 04: PlayState.js
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
		
		/* Reset the game score */
		this.game.score = 0;
		
		/* Stretch out the world */
		this.game.world.setBounds(0, 0, 800, 2400);
		
		/* Draw the background */
		this.game.add.image(0, 0, "road");
		
		/* Create the player */
		this.create_player();
		/* Set the camera to follow the player */
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.cars = this.game.add.group();
		this.cars.enableBody = true;		
		
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		
		this.civilians = this.game.add.group();
		this.civilians.enableBody = true;
		
		this.fighters = this.game.add.group();
		this.fighters.enableBody = true;
		this.create_fighter();
		
		this.text = this.game.add.text(20, 20, "Health: "+this.player.health+
			"\nScore: "+ this.game.score, {fill:"black", font: "16px Courier"});
			
		this.carSound = this.game.add.audio("car_sound", 1, false);
	},
	
	/* Update game every frame */
	update: function()
	{	
		this.update_text();
		
		/******************************/
		/**** Check for collisions ****/
		/******************************/
		
		/* Check if the player is colliding with bullets */
		this.collide_playerAndBullet();
		
		/* Check if a fighter is colliding with a car */
		this.collide_fighterAndCar();
		/* Check if a civilian is colliding with a car */
		this.collide_civilianAndCar();
		
		/* Check if the player is colliding with a civilian */
		this.collide_playerAndCivilian();
		
		/* End game if the car hits the player */
		if(this.game.physics.arcade.overlap(this.cars, this.player))
		{
			/* Update the player's score to the number of organs collected */
			this.game.state.start("game over");
		}
		
		/* Kill the player if health <= 0 */
		if(this.player.health<=0)
		{
			this.game.state.start("game over");
		}
		
		/* Collide the player and the fighters */
		this.game.physics.arcade.collide(this.player, this.fighters);
		
		/** Garbage Collect **/
		/* Destroy out of bounds cars */
		this.destroy_cars();
		/* Destroy out of bound bullets */
		this.destroy_bullets;
		
		
		/****************************/
		/**** Control the player ****/
		/****************************/
		
		/** Move the player around **/
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
		/* Check for cursors that are down */
		if(this.cursors.up.isDown)
		{
			this.player.animations.play("up");
			this.player.body.velocity.y = -this.player.baseSpeed;
			this.player.stopFrame = 0;
		}
		else if(this.cursors.left.isDown)
		{
			this.player.animations.play("left");
			this.player.body.velocity.x = -this.player.baseSpeed;
			this.player.stopFrame = 4;
		}
		else if(this.cursors.down.isDown)
		{
			this.player.animations.play("down");
			this.player.body.velocity.y = this.player.baseSpeed;
			this.player.stopFrame = 8;
		}
		else if(this.cursors.right.isDown)
		{
			this.player.animations.play("right");
			this.player.body.velocity.x = this.player.baseSpeed;
			this.player.stopFrame = 12;
		}
		else
		{
			this.player.frame = this.player.stopFrame;
		}
		
		
		/**********************************/
		/**** Create the world objects ****/
		/**********************************/
		
		/* Create cars at random */
		if(Math.floor(Math.random()*1000) === 0 && this.check_carsInBegining())
		{
			this.create_car();
		}
		
		/* Create fighter at random */
		if(Math.floor(Math.random()*750) === 0)
		{
			this.create_fighter();
			console.log("Fighter created");
		}
		
		/* Create a civilian at random */
		if(Math.floor(Math.random()*500) === 0)
		{
			this.create_civilian();
		}
		
		/* If player is in a 200 pixel radius of a fighter fire */
		for(var i = 0; i < this.fighters.children.length; i++)
		{
			if(this.distSq(this.player, this.fighters.children[i]) < 200*200)
			{
				this.fighters.children[i].fireBullet();
			}
		}
		
		this.play_carSound();
	},
	
	/* Creates the players character sprite */
	create_player: function()
	{
		/* The player and its settings */
		this.player = this.game.add.sprite(this.game.world.width/2, 
			this.game.world.height-42, "zombie", 32);

		/* Enable physics on the player */
		this.game.physics.arcade.enable(this.player);
		this.player.body.setSize(40, 40, 1, 1);
		
		this.player.anchor.setTo(0.5, 0.5);
		
		/* Player physics properties. Give the little guy a slight bounce. */
		this.player.body.collideWorldBounds = true;
	
		/* Add player animations */
		this.player.animations.add(   "up", [ 0,  1,  2,  3], 5, true);
		this.player.animations.add( "left", [ 4,  5,  6,  7], 5, true);
		this.player.animations.add( "down", [ 8,  9, 10, 11], 5, true);
		this.player.animations.add("right", [12, 13, 14, 15], 5, true);
		this.player.stopFrame = 0;
		
		/* Create a base speed for the player */
		this.player.baseSpeed = 200;
		this.player.health = 100;
		
		/* Create sound effects */
		this.attack_audio = this.game.add.audio("attack", 1, false);
	},
	
	/* Create a car driving south on the road */
	create_car: function()
	{
		var car = this.cars.create((Math.random()*280)+200, -240, "car");
		
		/* Start moving to down */
		car.body.velocity.y = 800;
	},
	
	/* Check if there is already a car in the first 200 pixels.         */
	/* Returns a boolean for if there is a car in the first 200 pixels. */
	check_carsInBegining: function()
	{
		for(var i = 0; i < this.cars.children.length; i++)
		{
			if(this.cars.children[i].y <= 400)
			{
				/* Remove the car */
				return false;
			}
		}
		return true;
	},
	
	play_carSound: function()
	{
		for(var i = 0; i < this.cars.children.length && 
			!this.carSound.isPlaying; i++)
		{
			if(this.cars.children[i].y > this.game.camera.y - 1600 &&
			   this.cars.children[i].y < this.game.camera.y + 
				this.game.camera.height)
			{
				this.carSound.play();
			}
		}	
	},
	
	/* Destroy any cars out of bounds */
	destroy_cars: function()
	{
		for(var i = 0; i < this.cars.children.length; i++)
		{
			if(this.cars.children[i].y > this.game.world.height)
			{
				/* Remove the car */
				this.cars.remove(this.cars.children[i], true);
				i--;
			}
		}
	},
	
	/* Creates a fighter sprite */
	create_fighter: function()
	{
		/* The fighter and its settings */
		var fighter = this.fighters.create(Math.random()*this.game.world.width, 
			Math.random()*this.game.world.height, "fighter", 32);

		fighter.body.immovable = true;	
		
		fighter.body.setSize(40, 40, 1, 1);
		
		fighter.anchor.setTo(0.5, 0.5);
		
		/* Player physics properties. Give the little guy a slight bounce. */
		fighter.body.collideWorldBounds = true;
	
		/* Add player animations */
		fighter.animations.add(   "up", [ 0,  1,  2,  3], 5, true);
		fighter.animations.add( "left", [ 4,  5,  6,  7], 5, true);
		fighter.animations.add( "down", [ 8,  9, 10, 11], 5, true);
		fighter.animations.add("right", [12, 13, 14, 15], 5, true);
		fighter.stopFrame = 0;
		
		/* Create a base speed for the player */
		fighter.baseSpeed = 200;
		fighter.reloadTime = 0;
		/* Keep a copy of the player */
		fighter.player = this.player;
		/* Keep a copy of the bullets group */
		fighter.bullets = this.bullets;
		
		/* Method for firing a bullet towards the player */
		fighter.fireBullet = function()
		{
			/* Rotate the fighter to face the player */
			this.rotation = this.game.physics.arcade.angleToXY(this, 
				this.player.x, this.player.y) + (Math.PI/2);
			
			/* If the fighter can fire */
			if(this.reloadTime === 0)
			{
				/* Compute the x and y coordinates of the gun */
				var gunX = Math.cos(this.rotation - (Math.PI/4))*28.29 + this.x;
				var gunY = Math.sin(this.rotation - (Math.PI/4))*28.29 + this.y;
				
				/* Create a bullet at the gun's coordinates */
				var bullet = this.bullets.create(gunX, gunY, "bullet");
				
				/** Compute XY Velocity from the magnitude and angle **/
				/* Compute angle */
				bullet.rotation = this.game.physics.arcade.angleToXY(bullet, 
					this.player.x, this.player.y)-(Math.PI/2);
				/* Compute components of the velocity */
				bullet.body.velocity.x = Math.cos(bullet.rotation+(Math.PI/2)) *
					1000;
				bullet.body.velocity.y = Math.sin(bullet.rotation+(Math.PI/2)) *
					1000;
			
				/* Reset the reload counter to 75 */
				this.reloadTime = 75;
				
				/* Create sound effects */
				var gunshot = this.game.add.audio("gunshot", 1, false);
				gunshot.play();
			}
			else
			{
				/* Decrement the reload count */
				this.reloadTime--;
			}
		};
	},
	
	/* Destroy any bullets out of bounds */
	destroy_bullets: function()
	{
		for(var i = 0; i < this.bullets.children.length; i++)
		{
			if( this.bullets.children[i].y > this.game.world.height ||
				this.bullets.children[i].y < 0                      ||
				this.bullets.children[i].x > this.game.world.width  ||
				this.bullets.children[i].x < 0                       )
			{
				/* Remove the car */
				this.bullets.remove(this.bullets.children[i], true);
				i--;
			}
		}
	},
	
	/* Collide the player and bullets */
	collide_playerAndBullet: function()
	{
		var passed = false
		while(!passed)
		{
			try
			{
				/* Kill the enemy if the enemy is hit by meteor */
				this.game.physics.arcade.overlap(this.player, this.bullets, 
					function(player, bullet)
					{ 
						this.player.health -= 10; 
						var blood = this.game.add.sprite(this.player.x, 
							this.player.y, "blood");
						blood.anchor.setTo(0.5, 1)
						blood.rotation = bullet.rotation;
						blood.animations.add("splatter");
						blood.animations.play("splatter", 64, false, true);
						
						this.bullets.remove(bullet, true);
					}, 
					null, this);
				passed = true;
			}
			catch(err)
			{
				//console.log("err");
			}
		}
	},	
	
	/* Collide the fighters and cars */
	collide_fighterAndCar: function()
	{
		var passed = false
		while(!passed)
		{
			try
			{
				/* Kill the enemy if the enemy is hit by meteor */
				this.game.physics.arcade.overlap(this.fighters, this.cars, 
					function(fighter, car)
					{ 
						this.fighters.remove(fighter, true);
					}, 
					null, this);
				passed = true;
			}
			catch(err)
			{
				//console.log("err");
			}
		}
	},
	
	/* Collide the fighters and cars */
	collide_civilianAndCar: function()
	{
		var passed = false
		while(!passed)
		{
			try
			{
				/* Kill the enemy if the enemy is hit by meteor */
				this.game.physics.arcade.overlap(this.civilians, this.cars, 
					function(civilian, car)
					{ 
						this.civilians.remove(civilian, true);
					}, 
					null, this);
				passed = true;
			}
			catch(err)
			{
				//console.log("err");
			}
		}
	},
	
	/* Collide the fighters and cars */
	/* Collide the fighters and cars */
	collide_playerAndCivilian: function()
	{
		var passed = false
		while(!passed)
		{
			try
			{
				/* Kill the enemy if the enemy is hit by meteor */
				this.game.physics.arcade.collide(this.civilians, this.player, 
					function(player, civilian)
					{ 
						//console.log(civilian.health);
						if(civilian.health > 0)
						{
							civilian.health -= 10;
							
							var blood = this.game.add.sprite(civilian.x, 
								civilian.y, "blood2");
							blood.anchor.setTo(0.5, 1);
							blood.rotation = this.game.physics.arcade.angleToXY(
								blood, player.x, player.y)+(Math.PI/2);
							blood.animations.add("splatter");
							blood.animations.play("splatter", 64, false, true);
							
							if(!this.attack_audio.isPlaying)
							{
								this.attack_audio.play();
							}
						}
						else
						{
							this.civilians.remove(civilian, true);
							this.game.score += 10
						}
					}, 
					null, this);
				passed = true;
			}
			catch(err)
			{
				//console.log("err");
			}
		}
	},

	/* Creates a civilian character */
	create_civilian: function()
	{
		/* Create a civilian at a random point */
		var civilian= this.civilians.create(Math.random()*this.game.world.width, 
			Math.random()*this.game.world.height, "civilian", 32);

		civilian.body.immovable = true;	
			
		civilian.body.setSize(40, 40, 1, 1);
		
		civilian.anchor.setTo(0.5, 0.5);
		
		civilian.health = 100;
	},
	
	update_text: function()
	{	
		this.text.x = this.game.camera.x+20;
		this.text.y = this.game.camera.y+20;
		this.text.text = "Health: " + this.player.health + "\nScore: " +
			this.game.score;
	},
	
	/* Calculate the distance squared between the two given objects */
	distSq: function(object1, object2)
	{
		//console.log("object1: "+ object1 + "\nobject2: "+ object2);
		if(object1   === undefined || object2   === undefined || 
		   object1.x === undefined || object1.y === undefined ||
		   object2.x === undefined || object2.y === undefined )
		{
			console.error("distSq(object1, object2): object1 or object2 does" + 
				" not have an x or y field.");
			return undefined;
		}
		
		var deltaX = object1.x - object2.x;
		var deltaY = object1.y - object2.y;

		return (deltaX*deltaX) + (deltaY*deltaY);
	}
};