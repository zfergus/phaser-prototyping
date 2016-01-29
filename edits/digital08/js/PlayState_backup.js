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
		this.game.stage.backgroundColor = 0x009999;
		
		this.player = this.game.add.sprite(this.game.world.width/2, this.game.world.height-40, "ship");
		this.game.physics.arcade.enable(this.player);
		this.player.anchor.setTo(0.5,0.5);
		this.player.BASE_SPEED = 360;
		
		this.ship1 = this.game.add.sprite(this.game.world.width/4, this.game.world.height-40, "ship");
		this.game.physics.arcade.enable(this.ship1);
		this.ship1.body.velocity.y = -128;
		this.ship1.frame = 1;
		this.ship.health = 100;
		
		this.ship2 = this.game.add.sprite(3*(this.game.world.width/4), this.game.world.height-40, "ship");
		this.game.physics.arcade.enable(this.ship2);
		this.ship2.body.velocity.y = -128;
		this.ship2.frame = 2;
		this.ship.health = 100;
		
		this.CANNON_SPEED = 1000;
		this.reload_time = 0;
		
		this.cannon_balls = [];
	},
	
	/* Update game every frame */
	update: function()
	{
		if(this.reload_time == 0 && this.game.input.activePointer.isDown)
		{
			var x = (this.game.input.activePointer.x > this.player.x) ? 
				this.player.x+12 : this.player.x-12;
			var y = this.player.y+2;
			var cannon_ball = this.game.add.sprite(x, y, "cannon-ball");
			this.game.physics.arcade.enable(cannon_ball); 
			cannon_ball.body.velocity.x = (this.game.input.activePointer.x < 
				this.player.x) ? (-this.CANNON_SPEED):(this.CANNON_SPEED );
			this.reload_time = 100;
			var shot = this.game.add.sound("cannon-shot");
			shot.play();
		}
		
		var x = this.player.BASE_SPEED * Math.cos(this.player.rotation-Math.PI/2);
		var y = this.player.BASE_SPEED * Math.sin(this.player.rotation-Math.PI/2);
		this.player.body.velocity.y = this.player.BASE_SPEED * ((this.game.input.activePointer.y - this.player.y)/400);
		if(this.player.body.velocity.y > 0)
		{
			this.player.frame = 3;
		}
		else
		{
			this.player.frame = 0;
		}
				
		this.reload_time = (this.reload_time > 0) ? this.reload_time-1:0;
	}
};