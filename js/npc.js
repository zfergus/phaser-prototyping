/*
 * Class for Non-Playable Characters
 * Created by Zachary Ferguson
 */
function NPC(x, y, game, sprite, dialoge)
{
	this.x = x;
	this.y = y;
	this.dialoge = dialoge;
	
	this.game = game;
	this.npc = game.add.sprite(x, y, sprite);
	
	/* Enable physics on the npc */
	game.physics.arcade.enable(this.npc, Phaser.Physics.ARCADE);
	game.physics.arcade.enable(this.npc);
	this.npc.body.immovable = true;
	
	this.text = this.game.add.text(this.x - 28, this.y - 16, "", 
		{fill: "blue", font: "bold 12px Courier New", align: "center", stroke: "black"});
}

NPC.prototype.speak = function()
{
	this.text.text = this.dialoge;
	this.text.x = this.x - 28;
	this.text.y = this.y - 16;
}

NPC.prototype.mute = function()
{
	this.text.text = "";
}
