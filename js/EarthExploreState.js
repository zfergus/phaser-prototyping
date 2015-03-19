/*
 * SpaceSim: ExploreState.js
 * Created by Zachary Ferguson
 * Game State Class for exploring the different celestial bodies.
 */

"use strict";
 
function EarthExploreState() {};

EarthExploreState.prototype = 
{
/* Create the tilemap, player, and groups */
	create: function()
	{
		console.log("EarthExploreState");
		
		/* Stretch the world vertically */
		this.game.world.setBounds(0, 0, 800, 7200);
		/* Reposition the camera */
		this.game.camera.y = 0;
		
		/* Add the background image */
		this.game.add.image(0, 0, "earth-sky");
		
		/* Create a ground sprite */
		this.ground = this.game.add.sprite(0, this.game.world.height-40, 
			"earth-ground");
		/* Enable physics on the ground */
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		
		var EARTH_GRAVITY = 9.81, EARTH_DRAG = 50; 
		
		/* Create the ship on the ground */
		this.ship = this.game.add.existing(new Ship(this.game, 
			this.game.width/2, 10, this.game.remainingFuel, 
			EARTH_GRAVITY, EARTH_DRAG));
		this.ship.rotation = Math.PI;
		/* Enable physics on the ship */
		this.game.physics.arcade.enable(this.ship);
		
		/* Enable the arrow keys for controls */
		this.controls = this.game.input.keyboard.createCursorKeys();
		
		this.endMessage = "You died as billions watched for your return.";
		
		PlayState.prototype.create_hud.call(this);
	},
	
	/* Update game every frame */
	update: function()
	{
		MarsExploreState.prototype.update.call(this);
	}
};