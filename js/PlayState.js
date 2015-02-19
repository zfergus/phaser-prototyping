/*
 * State Class for the main game
 * Created by Zachary Ferguson
 */

"use strict";
 
function PlayState() {};

PlayState.prototype = 
{	
	create: function()
	{
		console.log("Play");
		
		// Make the world a bit bigger than the stage so we can shake the camera
		this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);
		
		this.game.stage.backgroundColor = 0x142849;
		this.game.add.image(0,0,"sky");
		
		this.startTime = (new Date()).getTime();
		
		/* Create tile map */
		this.tilemap = this.game.add.tilemap("world");
		this.tilemap.addTilesetImage("tileset", "tileset");
		this.ground = this.tilemap.createLayer("ground");
		this.wall   = this.tilemap.createLayer(  "wall");
		/* Set collisions */
		this.tilemap.setCollision(1, true, this.ground);
		this.tilemap.setCollision(2, true, this.wall);
		
		/* Create sprites and groups */
		this.player = this.game.add.sprite(46, 428, "player");
		this.player.frame = 8;

		this.meteors = this.game.add.group();
		this.meteors.enableBody = true;
		
		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		this.create_enemy();
		this.enemiesKilled = 0;
		this.killed = this.game.add.text(800-200, 20, "Enemies Killed: "+
			this.enemiesKilled,{fill:"white", font: "16px Courier", 
			align: "center"});
		
		this.attackCount = 16;
		this.count = this.game.add.text(20, 20, "Spell Count: "+this.attackCount,
			{fill:"white", font: "16px Courier", align: "center"});
			
		this.game.input.onTap.add(this.attack, this);
		
		this.attack_audio = this.game.add.audio("fireball", 1, false);
		this.explosion_audio = this.game.add.audio("explosion", .05, false);
	},
	
	update: function()
	{
		//console.log(this.enemy);
		var passed = false
		while(!passed)
		{
			try
			{
				/* Kill the enemy if the enemy is hit by meteor */
				this.game.physics.arcade.collide(this.meteors, this.enemies, 
					this.meteorStrike, this.checkAlive, this);
				passed = true;
			}
			catch(err){console.log("err");}
		}
			
		/* End game if the enemy reaches the player */
		if(this.game.physics.arcade.collide(this.enemies, this.wall))		
		{
			this.game.score = this.enemiesKilled;
			this.game.state.start("game over");
		}
		
		/* Increase attack points if applicable */
		this.attackCount += (((new Date()).getTime()%2000 < 20 && 
							   this.attackCount < 16) ? 1:0);
		if(this.attackCount===0)
			this.count.fill = "red";
		else
			this.count.fill = "white";
		this.count.text  =   "Attack Count: " + this.attackCount;
		this.killed.text = "Enemies Killed: " + this.enemiesKilled;
		
		/* Spawn new enemies */
		if((new Date()).getTime() - this.startTime > 8000/((this.enemiesKilled%16)+1) &&
			this.enemies.length < 16)
		{
			this.create_enemy();
			this.startTime = (new Date()).getTime();
		}
	},
	
	create_enemy: function()
	{
		var enemy = this.enemies.create(801, 508, "enemy");
		enemy.animations.add( "left", [ 4,  5,  6,  7], 5, true);
		
		/* Start moving */
		enemy.body.velocity.x = -128;
		enemy.animations.play("left");
	},
	
	attack: function()
	{
		/* Check for enough attack power */
		if(this.attackCount <= 0) return;

		/* Create a meteor */
		var meteor = this.meteors.create(Math.random()*800, 0, "meteor");
		
		meteor.animations.add("spin", [0, 1], 10, true);
		meteor.animations.play("spin");
		
		/* Compute XY Velocity  */
		var theta = this.game.physics.arcade.angleToPointer(meteor);
		//console.log(theta);
		meteor.body.velocity.x = Math.cos(theta) * 1000;
		meteor.body.velocity.y = Math.sin(theta) * 1000;
		
		meteor.checkWorldBounds = true;
		meteor.outOfBoundsKill = true;
		
		if(!this.attack_audio.isPlaying)
			this.attack_audio.play();
		
		this.attackCount--;
	},
	
	meteorStrike: function(meteor, enemy)
	{
		/* Create dead enemy */
		/*
		enemy.visible = false;
		var dead_enemy = this.game.add.sprite(enemy.body.x, enemy.body.y, "enemy", 0);
		dead_enemy.enableBody = true;
		game.physics.arcade.enable(dead_enemy);
        dead_enemy.body.velocity.y = this.game.rnd.integerInRange(-400, -800);
        dead_enemy.body.velocity.x = this.game.rnd.integerInRange(-250, 250);
        dead_enemy.body.acceleration.y = 3000;
        dead_enemy.angle = 180;
		*/
		/* Remove the enemy */
		this.enemies.remove(enemy, true);
		
		/* Create an explosion */
		var explosion = this.game.add.sprite(meteor.x, 504, "explosion");
		explosion.animations.add("explode", [0,1,2,3,4,5,6,7], 32, false);
		explosion.animations.play("explode", 32, false, true);
		if(!this.explosion_audio.isPlaying)
			this.explosion_audio.play();
		
		/* Remove the meteor */
		this.meteors.remove(meteor, true);
		
		this.enemiesKilled++;
		
		/* Shake the camera if not on mobile */
		if(!this.mobilecheck())
		{
			this.game.camera.y = 0;
			this.game.add.tween(this.game.camera)
				.to({ y: -10 }, 10, Phaser.Easing.Sinusoidal.InOut, false, 0, 5,
					true)
				.start();
		}
	},
	
	/* Checks if the game is being played on a mobile device.      */
	/* Returns a boolean for if the browser is on a mobile device. */
	mobilecheck: function()
	{
		var check = false;
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
		{
			check = true;
		}		
		return check;
	}
};