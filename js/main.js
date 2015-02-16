/*
 * Class for creating and starting the game
 * Created by Zachary Ferguson
 */
 
"use strict";
 
function Game() {};
 
Game.prototype = 
{
  start: function() 
  {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, "game");
 
    game.state.add("boot", BootState);
    game.state.add("preload", PreloadState);
    game.state.add("intro", IntroState);
    //game.state.add("overworld", OverworldState);
    game.state.start("boot");
  }
};

window.onload = function()
{
	var game = new Game();
	game.start();
}