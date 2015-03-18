/*
 * SpaceSim: GameOverState.js
 * Created by Zachary Ferguson
 * The Ship class that inherits from the Phaser.Sprite class.
 */

"use strict";
 
var Ship = function(game, x, y)
{
	/* Create the ship sprite. */
	Phaser.Sprite.call(this, game, x, y, "ship");
	this.anchor.setTo(0.5, 1.0);
	
	/* Set the camera to follow the ship */
	this.game.camera.follow(this);
	
	/* Create the flame as a child sprite of the ship. */
	this.burn = game.add.sprite(0, 0, "burn");
	this.burn.anchor.setTo(0.5,0);
	/* Make the burn invisible*/
	this.burn.alpha = 0;
	/* Add the burn as a child so it moves with the ship */
	this.addChild(this.burn);	
	
	/* Enable physics on the ship */
	this.game.physics.arcade.enable(this);
	
	/* Create base physics values for the ship */
	this.METERSTOPIXELS = 10;
	this.mass = 3110; /* Kg */
	this.fuel = 500;
	this.fuelConsumption = 0;
	this.thrust = 100000.0; /* Kg*meters/s/s */
	this.body.gravity.y = 9.8 * this.METERSTOPIXELS; /* pixels/s/s */
	this.body.bounce.setTo(0.05, 0.05);
	this.body.maxVelocity.setTo(500, 1000);
	this.body.drag.setTo(20, 20);
}

 /* Ships are a type of Phaser.Sprite */
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

/* Engages the engines thrusters. */
Ship.prototype.engageEngines = function()
{
	if(this.fuel > 0)
	{
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
	var exhaust = this.game.add.sprite(this.x, this.y+5, "exhaust");
	exhaust.anchor.setTo(0.5, 0.5);
	exhaust.rotation = Math.random() * 2*Math.PI;
	exhaust.animations.add("fade");
	exhaust.animations.play("fade", 16, false, true);/* killOnComplete = true */
}

/* Update this ship every frame. */
Ship.prototype.update = function()
{	
	this.consumeFuel();
}