/*
 * SpaceSim: Ship.js
 * Created by Zachary Ferguson
 * The Ship class that inherits from the Phaser.Sprite class.
 */

"use strict";

function Ship(game, x, y, fuel, gravity, drag, water)
{
	/* Create the ship sprite. */
	Phaser.Sprite.call(this, game, x, y, "ship");
	this.anchor.setTo(0.5, 0.55);
	
	/* Set the camera to follow the ship */
	this.game.camera.follow(this);
	
	/* Create the flame as a child sprite of the ship. */
	this.burn = game.add.sprite(0, 18, "burn");
	this.burn.anchor.setTo(0.5,0);
	/* Make the burn invisible*/
	this.burn.alpha = 0;
	/* Add the burn as a child so it moves with the ship */
	this.addChild(this.burn);	
	
	/* Enable physics on the ship */
	this.game.physics.arcade.enable(this);
	
	/* Create base physics values for the ship */
	this.METERSTOPIXELS = 10;
	
	this.fuel = fuel;
	this.fuelConsumption = 0;
	this.water = water;
	/* Mass of the ship */
	/* Mass = amount_of_fuel * mass_of_fuel + mass_of_ship */
	this.mass = this.fuel*5.0 + this.water + 1000.0; /* Kg */
	this.thrust = 100000.0; /* Kg*meters/s/s */
	/* Physics body values */
	this.body.gravity.y = gravity * this.METERSTOPIXELS; /* pixels/s/s */
	this.body.bounce.setTo(0.05, 0.05);
	this.body.maxVelocity.setTo(500, 1000);
	this.body.drag.setTo(drag, drag);
	/* Angular velocity */
	this.OMEGA = 90;
}

 /* Ships are a type of Phaser.Sprite */
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

/* Engages the engines thrusters. */
Ship.prototype.engageEngines = function()
{
	if(this.fuel > 0)
	{
		/* Mass = amount_of_fuel * mass_of_fuel + mass_of_ship */
		this.mass = this.fuel*5.0 + 1000.0; /* Kg */
		
		if(Math.floor(Math.random()*4) === 0) this.addExhaust();
		this.fuelConsumption = 0.5;
		this.burn.alpha = 1;
		
		var xAcceleration = (this.thrust/this.mass)*Math.cos(this.rotation+
			(Math.PI/2)); 
		var yAcceleration = (this.thrust/this.mass)*Math.sin(this.rotation+
			(Math.PI/2));

		this.body.acceleration.x = -xAcceleration * this.METERSTOPIXELS;
		this.body.acceleration.y = -yAcceleration * this.METERSTOPIXELS;
	}
}

/* Disengages the engines thrusters. */
Ship.prototype.disengageEngines = function()
{
	this.fuelConsumption = 0;
	this.burn.alpha = 0;
		
	this.body.acceleration.x = 0;
	this.body.acceleration.y = 0;
}

/* Consumes the active fuel consumption amount. */
Ship.prototype.consumeFuel = function()
{	
	if(this.fuel > 0)
	{
		this.fuel -= this.fuelConsumption;
	}
}

/* Creates an exhaust fume that dies after on compete. */
Ship.prototype.addExhaust = function()
{
	/* Calculate the exhaust point to create the new exhaust at. */
	var exhaustX = Math.cos(this.rotation + Math.PI/2) * 23 + this.x;
	var exhaustY = Math.sin(this.rotation + Math.PI/2) * 23 + this.y;
	
	var exhaust = this.game.add.sprite(exhaustX, exhaustY, "exhaust");
	exhaust.anchor.setTo(0.5, 0.5);
	exhaust.rotation = Math.random() * 2*Math.PI;
	exhaust.animations.add("fade");
	exhaust.animations.play("fade", 16, false, true);/* killOnComplete = true */
}

/* Consumes the water consumption amount. */
Ship.prototype.consumeWater = function()
{	
	this.water -= 0.025;
}

/* Update this ship every frame. */
Ship.prototype.update = function()
{	
	this.consumeFuel();
	this.consumeWater();
}