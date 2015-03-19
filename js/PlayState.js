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
		this.game.world.setBounds(0, 0, 800, 7200);
		/* Reposition the camera */
		this.game.camera.y = this.game.world.height-600;
		
		/* Add the background image */
		this.game.add.image(0, 0, "earth-sky");
		
		/* Create a ground sprite */
		this.ground = this.game.add.sprite(0, this.game.world.height-40, 
			"earth-ground");
		/* Enable physics on the ground */
		this.game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;
		
		var EARTH_GRAVITY = 9.81, EARTH_DRAG = 50;
		var initialFuel = 1000; /*~~~ Add input here ~~~*/
		
		/* Create the ship on the ground */
		this.ship = this.game.add.existing(new Ship(this.game, 
			this.game.world.width/2, this.ground.y-18, initialFuel, EARTH_GRAVITY,
			EARTH_DRAG));
		
		this.launchPad = this.game.add.sprite(this.game.world.width/2, 
			this.ground.y+6, "launch-pad");
		this.launchPad.anchor.setTo(0.5, 1.0);
		/* Enable physics on the LaunchPad */
		//this.game.physics.arcade.enable(this.launchPad);
		//this.launchPad.body.immovable = true;
		
		/* Enable the arrow keys for controls */
		this.controls = this.game.input.keyboard.createCursorKeys();
		
		this.create_hud();
	},
	
	create_hud: function()
	{
		var hud = this.game.add.image(0, this.game.camera.y + 
			this.game.camera.height-20, "control-bar");
		//(new Phaser.Group(this.game, null)).add(hud);
		
		this.fuelDisplay = this.game.add.text(10, 2, "Fuel: "+this.ship.fuel,
			{fill:"white", font: "18px Courier", align: "center"});
		hud.addChild(this.fuelDisplay);
	},
	
	/* Update game every frame */
	update: function()
	{
		/* Collide the ground and ship */
		this.game.physics.arcade.collide(this.ground, this.ship);
		//this.game.physics.arcade.collide(this.launchPad, this.ship);
		
		if(this.ship.y < 0)
		{
			this.game.fuelLeft = this.ship.fuel;
			this.game.state.start("solar map");
		}
		
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
				theta = this.ship.OMEGA;
			}
			else if(this.controls.left.isDown)
			{
				theta = -this.ship.OMEGA;
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