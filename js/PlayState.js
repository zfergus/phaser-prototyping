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
		//this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);
		
		//this.game.stage.backgroundColor = 0x142849;
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
		this.attackCount = 16;
		
		this.meteors = [];
		
		this.enemies = [];
		this.create_enemy();
		this.enemiesKilled = 0;
		this.killed = this.game.add.text(800-200, 20, "Enemies Killed: "+
			this.enemiesKilled,{fill:"white", font: "16px Courier", 
			align: "center"});
		
		this.count = this.game.add.text(20, 20, "Attack Count: "+this.attackCount,
			{fill:"white", font: "16px Courier", align: "center"});
			
		this.game.input.onTap.add(this.attack, this);
		
		this.attack_audio = this.game.add.audio("fireball", .75, false);
	},
	
	update: function()
	{
		/* Kill the enemy if the enemy is hit by meteor */
		this.game.physics.arcade.collide(this.meteors, this.enemies, 
			this.meteorStrike, null, this);
			
		/* End game if the enemy reaches the player */
		if(this.game.physics.arcade.collide(this.enemies, this.wall))		
			this.game.state.start("game over");
		
		/* Increase attack points if applicable */
		this.attackCount += (((new Date()).getTime()%2000 < 20 && 
							   this.attackCount < 16) ? 1:0);
		if(this.attackCount===0)
			this.count.fill = "red";
		else
			this.count.fill = "white";
		this.count.text  =   "Attack Count: " + this.attackCount;
		this.killed.text = "Enemies Killed: " + this.enemiesKilled;
		
		if((new Date()).getTime() - this.startTime > 8000/(this.enemiesKilled+1) &&
			this.enemies.length < 24)
		{
			this.create_enemy();
			this.startTime = (new Date()).getTime();
		}
	},
	
	create_enemy: function()
	{
		var enemy = this.game.add.sprite(801, 508, "enemy");
		enemy.animations.add( "left", [ 4,  5,  6,  7], 5, true);
		
		/* Enable physics on the enemy */
		this.game.physics.arcade.enable(enemy);
		//enemy.body.immovable = true;
		
		/* Start moving */
		enemy.body.velocity.x = -128;
		enemy.animations.play("left");
		
		this.enemies[this.enemies.length] = enemy;
	},
	
	attack: function()
	{
		/* Check for enough attack power */
		if(this.attackCount <= 0) return;
		
		var meteor = this.game.add.sprite(Math.random()*800, 0, "meteor");
		this.game.physics.arcade.enable(meteor);
		
		meteor.animations.add( "spin", [0, 1], 10, true);
		meteor.animations.play("spin");
		
		/* Compute XY Velocity  */
		var theta = this.game.physics.arcade.angleToPointer(meteor);
		//console.log(theta);
		meteor.body.velocity.x = Math.cos(theta) * 1000;
		meteor.body.velocity.y = Math.sin(theta) * 1000;
		
		this.meteors[this.meteors.length] = meteor;
		if(!this.attack_audio.isPlaying)
			this.attack_audio.play();
		
		this.attackCount--;
	},
	
	meteorStrike: function(meteor, enemy)
	{
		this.enemies = this.enemies.slice(this.enemies.indexOf(enemy));
		enemy.destroy();
		this.meteors = this.meteors.slice(this.meteors.indexOf(meteor));
		meteor.destroy();
		this.enemiesKilled++;
		//console.log(this.enemiesKilled);
		//console.log(this.enemies);
		/* Shake the camera by moving it up and down 5 times really fast*/
		//this.game.camera.y = 0;
		//this.game.add.tween(this.game.camera)
		//	.to({ y: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
		//	.start();
	}
};