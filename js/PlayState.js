/*
 * Digital 08: PlayState.js
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

		/* Constants for the phases of gameplay. */
		this.BUILD_PHASE = 0;
		this.DEFEND_PHASE = 1;
		
		/* Buying power for ships. */
		this.gold = 1000;
		/* Amount of ships that can pass. */
		this.lives = 3;
		/* Build Phase. */
		this.phase = this.BUILD_PHASE;
		
		/* Land to protect */
		this.land = this.game.add.sprite(0, this.game.world.height-80, "land");
		this.game.physics.arcade.enable(this.land);
		this.land.body.immovable = true;
		
		/* Button to switch phases. */
		this.startB = this.game.add.button(10, 10, "startB",
			function()
			{
				this.phase = this.DEFEND_PHASE;
				this.startB.destroy();
			}, this);
			
		/* Number of frames before active again. */
		this.refresh_time = 0;
		this.respawn_time = 0;
		
		/* Groups for game objects. */
		this.defenders = this.game.add.group();
		this.attackers = this.game.add.group();
		this.attackers.enableBody = true;
		this.cannon_balls = this.game.add.group();
		this.cannon_balls.enableBody = true;
		
		/* HUD Text */
		this.gold_text = this.game.add.text(5, this.game.world.height-20, 
			"Gold: " + this.gold,
			{fill:"white", font: "20px Courier", align: "center"});
			
		this.lives_text = this.game.add.text(this.game.world.width-5, 
			this.game.world.height-20, "Lives: " + this.lives,
			{fill:"white", font: "20px Courier", align: "center"});
		this.lives_text.anchor.setTo(1, 0);
	},
	
	/* Update game every frame */
	update: function()
	{
		/* Create defender ships. */
		if(this.game.input.activePointer.isDown && this.refresh_time <= 0 && 
			this.gold >= 100)
		{
			this.refresh_time = 10;
			this.gold -= 100;
			var ship = this.defenders.create(this.game.input.activePointer.x, 
				this.game.input.activePointer.y, "ship");
			ship.reload_time = 0;
		}
		
		if(this.phase == this.DEFEND_PHASE && this.respawn_time <= 0)
		{
			this.respawn_time = 60;
			var ship = this.attackers.create(Math.random() * 700 + 40, -40, 
				"ship", 5);
			ship.body.velocity.y = 100;
			ship.health = 100;
		}
		
		/* Count down */
		this.refresh_time--;
		this.respawn_time--;
		
		/* Fire on enemy */
		for(var i = 0; i < this.defenders.length; i++)
		{
			for(var j = 0; j < this.attackers.length; j++)
			{
				if(this.distSq(this.defenders.getAt(i), 
					this.attackers.getAt(j)) < 100*100)
				{
					this.shoot(this.defenders.getAt(i), 
						this.attackers.getAt(j));
				}
			}
		}
		
		this.gold_text.text = "Gold: "+this.gold;
		var hearts = "";
		for(var i = 0; i < 3; i++)
		{
			if(i < this.lives)
				hearts += "♥";
			else
				hearts += " ";
		}
		this.lives_text.text = "Lives: "+hearts;
		
		this.game.physics.arcade.overlap(this.attackers, this.cannon_balls, 
			function(attacker, ball)
			{
				attacker.health -= 25;
				ball.kill();
			}, null, this);
			
		this.game.physics.arcade.overlap(this.attackers, this.land, 
			function(attacker, land)
			{
				attacker.health = 0;
				land.kill();
				this.lives--;
			}, null, this);
			
		for(var i = 0; i < this.attackers.length; i++)
		{
			if(this.attackers.getAt(i).health <= 0)
			{
				this.attackers.remove(this.attackers.getAt(i), true);
				this.gold += 50;
				this.game.score += this.gold;
				i--;
			}
		}
		
		if(this.lives < 0)
		{
			this.game.state.start("game over");
		}
	},
	
	/* Calculate the distance squared */
	distSq: function(s1, s2)
	{
		var x = s2.x - s1.x;
		x *= x;
		var y = s2.y - s1.y;
		y *= y;
		return y + x;
	},
	
	shoot: function(s1, s2)
	{
		if(s1.reload_time <= 0)
		{	
			var ball = this.cannon_balls.create(s1.x+16, s1.y+16, "cannon-ball");
			var theta = this.game.physics.arcade.angleToXY(ball, s2.x+16, s2.y+16);
			ball.body.velocity.x = 1000 * Math.cos(theta);
			ball.body.velocity.y = 1000 * Math.sin(theta);
			s1.reload_time = 50;
			var shot = this.game.add.sound("cannon-shot");
			shot.play();
		}
		else
		{
			s1.reload_time--;
		}
	}
};