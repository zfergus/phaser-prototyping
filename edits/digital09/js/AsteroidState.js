/*
 * SpaceSim: AsteroidState.js
 * Created by Zachary Ferguson
 * Game State Class for exploring the asteroid belt.
 */

"use strict";
 
function AsteroidState() {};

AsteroidState.prototype = 
{
/* Create the tilemap, player, and groups */
	create: function()
	{
		console.log("NeptuneExploreState");
		
		/* Stretch the world vertically */
		this.game.world.setBounds(0, 0, 2400, 600);
		/* Reposition the camera */
		this.game.camera.y = 0;
		
		/* Add the background image */
		this.game.add.tileSprite(0, 0, 2400, 600, "stars");
		
		/* Create the asteroids. */
		this.asteroids = this.game.add.group();
		this.asteroids.enableBody = true;
		this.create_asteroids(15, this.asteroids);
		
		/* Create the ship */
		this.ship = this.game.add.existing(new Ship(this.game, 40, 
			this.game.rnd.integerInRange(0, this.game.world.height), 
			this.game.remainingFuel, 0, 0));
		//this.ship.angle = this.game.rnd.integerInRange(-60, -120);
		this.ship.body.velocity.setTo(this.game.rnd.integerInRange(5, 15), 
			 this.game.rnd.integerInRange(5, 10));
		this.ship.rotation = Math.atan2(this.ship.body.velocity.x, 
			this.ship.body.velocity.y)
		/* Enable physics on the ship */
		this.game.physics.arcade.enable(this.ship);
		
		/* Enable the arrow keys for controls */
		this.controls = this.game.input.keyboard.createCursorKeys();
		
		this.endMessage = "You died on impact.";
			
		PlayState.prototype.create_hud.call(this);
		this.thrusterSound = this.game.add.audio("thrusters");
	},
	
	/* Creates n asteroids in the group. */
	create_asteroids: function(n, group)
	{
		for(var i = 0; i < n; i++)
		{
			var x = Math.random()*this.game.world.width;
			var y = Math.random()*this.game.world.height;
			var ast = group.create(x, y, "asteroid");
			ast.body.angularVelocity = Math.random() * 15 + 5;
			ast.body.velocity.setTo(Math.random() * 20, Math.random() * 20);
			ast.frame = Math.floor(Math.random()*3);
		}
	},
	
	/* Update game every frame */
	update: function()
	{
		/* Collide the asteroids and the ship */
		this.game.physics.arcade.collide(this.asteroids, this.ship, 
			function()
			{
				this.thrusterSound.stop();
				
				/* explode */
				this.game.endMessage = this.endMessage;
				this.game.state.start("game over");
			}, 
			null, this);
		
		/* Keep the asteroids on the screen */
		for(var i = 0; i < this.asteroids.length; i++)
		{
			var ast = this.asteroids.getAt(i);
			// Keep the asteroid on the screen
			if (ast.y > this.game.height)
			{
				ast.y = 0;
			}
			else if (ast.y < 0)
			{
				ast.y = this.game.height;
			}
			
			// if (ast.x > this.game.width)
			// {
				// ast.x = 0;
			// }
			// else if (ast.x < 0)
			// {
				// ast.x = this.game.width;
			// }
		}
		
		/* Exit the asteroid belt. */
		if(this.ship.x <= 0)
		{
			this.thrusterSound.stop();
			this.game.remainingFuel = this.ship.fuel;
			this.game.solarX = 520;
			this.game.state.start("solar map");
		}
		else if(this.ship.x >= this.game.world.width)
		{
			this.thrusterSound.stop();
			this.game.remainingFuel = this.ship.fuel;
			this.game.solarX = 570;
			this.game.state.start("solar map");
		}
		
		// Keep the ship on the screen
		if (this.ship.y > this.game.height)
		{
			this.ship.y = 0;
		}
		else if (this.ship.y < 0)
		{
			this.ship.y = this.game.height;
		}
		
		PlayState.prototype.controlShip.call(this);
		
		this.fuelDisplay.text = "Fuel: "+ Math.floor((this.ship.fuel));
	}
};