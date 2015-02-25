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
		
		/* Stretch out the world */
		this.game.world.setBounds(0, 0, 800, 2400);
		
		/* Draw the background */
		this.game.add.image(0, 0, "road");
		
		/* Create the player */
		this.create_player();
		/* Set the camera to follow the player */
		this.game.camera.follow(this.player);
		
		/* Load controls */
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.cars = this.game.add.group();
		this.cars.enableBody = true;		
		
		this.fighters = this.game.add.group();
		this.fighters.enableBody = true;
		
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
	},
	
	/* Update game every frame */
	update: function()
	{
		if(this.player.health<=0)
		{
			this.game.state.start("game over");
		}
		
		/* Destroy out of bounds cars */
		this.destroy_cars();
		
		this.game.physics.arcade.collide(this.player, this.fighters);
		
		var passed = false
		while(!passed)
		{
			try
			{
				/* Kill the enemy if the enemy is hit by meteor */
				this.game.physics.arcade.collide(this.player, this.bullets, 
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
		
		/* End game if the car hits the player */
		if(this.game.physics.arcade.overlap(this.cars, this.player))	
		{
			/* Update the player's score to the number of organs collected */
			this.player.health-100;
		}
		
		/** Move the player around **/
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
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
		
		/* Create cars at random */
		if(Math.floor(Math.random()*1000) === 0 && this.check_carsInBegining())
		{
			this.create_car();
		}
		
		/* Create cars at random */
		if(Math.floor(Math.random()*750) === 0)
		{
			this.create_fighter();
			console.log("Fighter created");
		}
		
		for(var i = 0; i < this.fighters.children.length; i++)
		{
			if(this.distSq(this.player, this.fighters.children[i]) < 200*200)
			{
				this.fighters.children[i].fireBullet();
			}
		}
	},
	
	/* Creates the players character sprite */
	create_player: function()
	{
		/* The player and its settings */
		this.player = this.game.add.sprite(379, this.game.world.height-42, 
			"zombie", 32);

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
	},
	
	create_car: function()
	{
		var car = this.cars.create((Math.random()*280)+200, -240, "car");
		
		/* Start moving to down */
		car.body.velocity.y = 800;
	},
	
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
	
	destroy_cars: function()
	{
		for(var i = 0; i < this.cars.children.length; i++)
		{
			if(this.cars.children[i].y > this.game.world.height)
			{
				/* Remove the car */
				this.cars.remove(this.cars.children[i], true);
			}
		}
	},
	
	/* Creates a fighter sprite */
	create_fighter: function()
	{
		/* The fighter and its settings */
		var fighter = this.fighters.create(Math.random()*this.game.world.width, 
			Math.random()*this.game.world.height, "fighter", 32);

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
		fighter.player = this.player;
		fighter.bullets = this.bullets;
		
		fighter.fireBullet = function()
		{
			this.rotation = this.game.physics.arcade.angleToXY(this, 
				this.player.x, this.player.y) + (Math.PI/2);
			if(this.reloadTime === 0)
			{
				var bullet = this.bullets.create(this.x+20, this.y-20, "bullet");
				
				/** Compute XY Velocity from the magnitude and angle **/
				/* Compute angle */
				bullet.rotation = this.game.physics.arcade.angleToXY(bullet, 
					this.player.x, this.player.y)-(Math.PI/2);
				/* Compute components of the velocity */
				bullet.body.velocity.x = Math.cos(bullet.rotation+(Math.PI/2)) *
					500;
				bullet.body.velocity.y = Math.sin(bullet.rotation+(Math.PI/2)) *
					500;
			
				this.reloadTime = 75;
			}
			else
			{
				this.reloadTime--;
			}
		};
	},
	
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