/*
 * Class for Non-Playable Characters
 * Created by Zachary Ferguson
 */
 
 "use strict";
 
 /* Create a non-player character */
function NonPlayerCharacter(x, y, game, sprite, dialogue)
{
	this.x = x;
	this.y = y;
	this.velocity = Math.random() * 32+32; 
	this.dialogue = dialogue;
	this.n_lines = countNewLines(dialogue);
	
	this.direction = 0;
	
	this.game = game;
	this.npc = game.add.sprite(x, y, sprite);
	this.text_box = this.game.add.sprite(this.game.camera.x, this.game.camera.y+472, "text_box");
	this.text_box.visible = false;
	
	/* Add NPC animations */
	this.npc.animations.add( "left", [ 4,  5,  6,  7], 5, true);
	this.npc.animations.add("right", [ 8,  9, 10, 11], 5, true);
	
	/* Enable physics on the npc */
	game.physics.arcade.enable(this.npc);
	this.npc.body.immovable = true;
	
	/* Start moving */
	if(sprite !== "nesha")
	{
		if(Math.random() > .5)
		{
			this.npc.body.velocity.x = -this.velocity;
			this.npc.animations.play("left");
		}
		else
		{
			this.npc.body.velocity.x = this.velocity;
			this.npc.animations.play("right");
		}
	}
	
	
	this.text = this.game.add.text(this.x - 28, this.y - 16, "", 
		{fill: "black", font: "bold 20px Courier New", align: "center", 
		stroke: "black"});
	this.text.anchor = new PIXI.Point(0.5, 0.5);
}

/* Display the dialogue above the NPC */
NonPlayerCharacter.prototype.speak = function()
{
	/* Draw text bow */
	this.text_box.visible = true;
	this.text_box.x = this.game.camera.x;
	this.text_box.y = this.game.camera.y+472;
	
	this.text.text = this.dialogue;
	this.text.x = this.text_box.x + 400;
	this.text.y = this.text_box.y + 64;
}

/* Turns of the text of the characters dialogue */
NonPlayerCharacter.prototype.mute = function()
{
	this.text.text = "";
	this.text_box.visible = false;
}

/* Counts the number of lines the given string covers */
function countNewLines(str)
{
	return str.split(/\r\n|\r|\n/).length;
}

NonPlayerCharacter.prototype.move = function()
{
	if(this.npc.x + 32 < this.x)
	{
		this.npc.animations.play("right");
		this.npc.body.velocity.x = this.velocity;
	}
	else if(this.x + 32 < this.npc.x)
	{
		this.npc.animations.play("left");
		this.npc.body.velocity.x = -this.velocity;
	}
	else if(this.npc.body.velocity.x === 0)
	{
		/* Start moving */
		if(Math.random() > .5)
		{
			this.npc.body.velocity.x = -this.velocity;
			this.npc.animations.play("left");
		}
		else
		{
			this.npc.body.velocity.x = this.velocity;
			this.npc.animations.play("right");
		}
	}
}

/* Stop the NPC from moving */
NonPlayerCharacter.prototype.stop = function(playerX)
{
	/* Face the player */
	if(playerX > this.npc.x)
	{
		this.npc.animations.play("right");
	}
	else
	{
		this.npc.animations.play("left");
	}
	/* Stop animations */
	this.npc.animations.stop();
	/* Stop moving */
	this.npc.body.velocity.x = 0;
}