/*
 * SpaceSim: GameOverState.js
 * Created by Zachary Ferguson
 * Game State Class for displaying the Game Over screen and the player's score
 */

"use strict";
 
function SolarMapState() {};

SolarMapState.prototype = 
{	
	/* Create the tilemap, player, and groups */
	create: function()
	{
		console.log("Solar Map");
	
		/* Enable p2 physics */
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.setImpactEvents(true);
	
		this.game.world.setBounds(0, 0, 800, 600);
		
		/* Set up the collision groups */
		this.shipCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.game.physics.p2.updateBoundsCollisionGroup();
		
		/*******************/
		/* CelestialBodies */
		/*******************/
		
		/* Create the Solar System */
		this.earth = this.game.add.existing(
			new CelestialBody(this.game, 40, 240, 0, this.shipCollisionGroup)
		);
		this.moon = this.game.add.existing(
			new CelestialBody(this.game, this.earth.x+30, this.earth.y-30, 2, 
			this.shipCollisionGroup)
		);
		//this.earth.addChild(this.moon);
		this.mars = this.game.add.existing(
			new CelestialBody(this.game, 400, 500, 1, this.shipCollisionGroup)
		);
		this.neptune = this.game.add.existing(
			new CelestialBody(this.game, 700, 80, 3, this.shipCollisionGroup)
		);
		
		/****************/
		/* SolarMapShip */
		/****************/
		/* Create the ship near earth */
		this.ship = this.game.add.existing(
			new SolarMapShip(this.game, this.earth.x, this.earth.y+25, 
			this.shipCollisionGroup)
		);
		/* Set-up the collisions with the celestial bodies */
		this.ship.body.collides(this.earth.collisionGroup, function(){}, this);
		this.ship.body.collides(this.moon.collisionGroup, function(){console.log("moon")}, this);
		this.ship.body.collides(this.mars.collisionGroup, 
			function()
			{
				this.game.state.start("explore_mars");
			}, this);
		this.ship.body.collides(this.neptune.collisionGroup, 
			function()
			{
				this.game.state.start("explore_neptune");
			}, this);
			
		this.ship.rotation = Math.PI;
		
		/* Enable the arrow keys for controls */
		this.controls = this.game.input.keyboard.createCursorKeys();
	},
	
	/* Update game every frame */
	update: function()
	{
		// /* Collide the CelestialBodies and the ship */
		// this.game.physics.p2.collide(this.earth, this.ship);
		// this.game.physics.p2.collide(this.moon, this.ship);
		// this.game.physics.p2.collide(this.mars, this.ship);
		// this.game.physics.p2.collide(this.neptune, this.ship);
		
		PlayState.prototype.controlShip.call(this);
	}
};