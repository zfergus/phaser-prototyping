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
	this.text_box = this.game.add.sprite(this.game.camera.x, this.game.camera.y+472, "text_box");
	this.text_box.visible = false;
	
	/* Enable physics on the npc */
	game.physics.arcade.enable(this.npc, Phaser.Physics.ARCADE);
	game.physics.arcade.enable(this.npc);
	this.npc.body.immovable = true;
	
	this.text = this.game.add.text(this.x - 28, this.y - 16, "", 
		{fill: "black", font: "bold 20px Courier New", align: "center", 
		stroke: "black"});
	this.text.anchor = new PIXI.Point(0.5, 0.5);
}

/* Display the dialogue above the NPC */
NPC.prototype.speak = function()
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
NPC.prototype.mute = function()
{
	this.text.text = "";
	this.text_box.visible = false;
	/*
	if(this.text_box !== undefined)
	{
		this.text_box.destroy();
		this.text_box = undefined;
		console.log("killed;");
	}
	*/
}

/* Counts the number of lines the given string covers */
function countNewLines(str)
{
	return str.split(/\r\n|\r|\n/).length;
}
