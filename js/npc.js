/*
 * Class for Non-Playable Characters
 * Created by Zachary Ferguson
 */
 
 /* Create a non-playable character */
function NPC(x, y, game, sprite, dialogue)
{
	this.x = x;
	this.y = y;
	this.dialogue = dialogue;
	this.n_lines = countNewLines(dialogue);
	
	this.direction = 0;
	
	this.game = game;
	this.npc = game.add.sprite(x, y, sprite);
	
	/* Enable physics on the npc */
	game.physics.arcade.enable(this.npc, Phaser.Physics.ARCADE);
	game.physics.arcade.enable(this.npc);
	this.npc.body.immovable = true;
	
	this.text = this.game.add.text(this.x - 28, this.y - 16, "", 
		{fill: "blue", font: "bold 12px Courier New", align: "center", stroke: "black"});
}

/* Display the dialogue above the NPC */
NPC.prototype.speak = function()
{
	this.text.text = this.dialogue;
	this.text.x = this.x - (this.dialogue.length * 3)/this.n_lines;
	this.text.y = this.y - 16*this.n_lines;
}

/* Turns of the text of the characters dialogue */
NPC.prototype.mute = function()
{
	this.text.text = "";
}

/* Counts the number of lines the given string covers */
function countNewLines(str)
{
	return str.split(/\r\n|\r|\n/).length;
}
