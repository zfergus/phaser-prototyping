/*
 * SpaceSim: ExploreState.js
 * Created by Zachary Ferguson
 * Game State Class for exploring the different celestial bodies.
 */

"use strict";
 
function MoonExploreState() {};

MoonExploreState.prototype = 
{
/* Create the tilemap, player, and groups */
	create: function()
	{
		console.log("MoonExploreState");
		
		/* Stretch the world vertically */
		this.game.world.setBounds(0, 0, 800, 2400);
		/* Reposition the camera */
		this.game.camera.y = 0;
		
		/* Add the background image */
		this.game.add.image(0, 0, "moon-sky");
		
		/* Create a ground sprite */
		this.ground = this.game.add.sprite(0, this.game.world.height-40, 
			"moon-ground");
		/* Enable physics on the ground */
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		
		var MOON_GRAVITY = 1.62, MOON_DRAG = 0.0; 
		
		/* Create the ship on the ground */
		this.ship = this.game.add.existing(new Ship(this.game, this.game.rnd.
			integerInRange(0, this.game.world.width), 40, 
			this.game.remainingFuel, MOON_GRAVITY, MOON_DRAG));
		this.ship.angle = this.game.rnd.integerInRange(-180, 180);
		this.ship.body.velocity.setTo(this.game.rnd.integerInRange(50, 150), 
			this.game.rnd.integerInRange(50, 100));
		/* Enable physics on the ship */
		this.game.physics.arcade.enable(this.ship);
		
		/* Enable the arrow keys for controls */
		this.controls = this.game.input.keyboard.createCursorKeys();
		
		this.endMessage = "You first froze to death on the dark side\n\
			then burnt to a crisp in the sunlight.";
			
		PlayState.prototype.create_hud.call(this);
		this.thrusterSound = this.game.add.audio("thrusters");
	},
	
	/* Update game every frame */
	update: function()
	{
		MarsExploreState.prototype.update.call(this);
	}
};