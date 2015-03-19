/*
 * SpaceSim: GameOverState.js
 * Created by Zachary Ferguson
 * The CelestialBody class that inherits from the Phaser.Sprite class.
 */

 "use strict";

var CelestialBody = function(game, x, y, type, otherCollisionGroups)
{
	Phaser.Sprite.call(this, game, x, y, "celestial bodies");
	this.frame = type;
	this.anchor.setTo(0.5, 0.5);
	
	game.physics.p2.enable(this);
	this.body.kinematic = true;
	
	this.setBounds();
	
	//this.body.fixedRotation = true;
	//this.body.angularVelocity = -Math.random()/2;
	//this.body.angularDamping = 0;
	
	/* Create a new collision group for this body */
	this.collisionGroup = game.physics.p2.createCollisionGroup();
	game.physics.p2.updateBoundsCollisionGroup();
	this.body.setCollisionGroup(this.collisionGroup);
	/* Set other collision groups to collide with. */
	this.body.collides(otherCollisionGroups);
} 

/* Planets are a type of Phaser.Sprite */
CelestialBody.prototype = Object.create(Phaser.Sprite.prototype);
CelestialBody.prototype.constructor = CelestialBody;

CelestialBody.prototype.setBounds = function()
{
	switch(this.frame)
	{
		case 0:
			this.body.setCircle(20);
			break;
		case 1:
			this.body.setCircle(15);
			break;
		case 2:
			this.body.setCircle(5);
			break;
		case 3:
			this.body.setCircle(25);
			break;
		default:
			throw new Exception("Invalid Type");
	}
}