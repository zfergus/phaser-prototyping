/*
 *SpaceSim: PlayState.js
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
		
		/* Stretch the world vertically */
		this.game.world.setBounds(0, 0, 800, 9600);
		/* Reposition the camera */
		this.game.camera.y = this.game.world.height-600;
		
		/* Add the background image */
		this.game.add.image(0, 0, "sky");
		
		/* Create a ground sprite */
		this.ground = this.game.add.sprite(0, this.game.world.height-40, 
			"ground");
		/* Enable physics on the ground */
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		
		/* Create the ship on the ground */
		this.ship = this.game.add.existing(new Ship(this.game, 
			this.game.world.width/2, this.ground.y));
		
		/* Enable the arrow keys for controls */
		this.controls = this.game.input.keyboard.createCursorKeys();
	},
	
	/* Update game every frame */
	update: function()
	{
		/* Collide the ground and ship */
		this.game.physics.arcade.collide(this.ground, this.ship);
		
		if(this.ship.y < 0)
			this.game.state.start("solar map");
		
		// Keep the ship on the screen
		if (this.ship.x > this.game.width)
		{
			this.ship.x = 0;
		}
		if (this.ship.x < 0)
		{
			this.ship.x = this.game.width;
		}
		
		this.controlShip();
	},
	
	controlShip: function()
	{
		/* Rotate the ship left or right. */
		var theta = 0;
		//if(!this.ship.body.blocked.down)
		//{
			if(this.controls.right.isDown)
			{
				theta = 5;
			}
			else if(this.controls.left.isDown)
			{
				theta = -5;
			}
		//}
		this.ship.body.angularVelocity = theta;
		
		/* Engage or disengage thrusters. */
		if(this.controls.up.isDown && this.ship.fuel > 0)
		{
			this.ship.engageEngines();
		}
		else
		{
			this.ship.disengageEngines();
		}
	}
};