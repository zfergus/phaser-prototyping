/*
 * Kittens!
 * Created by Zachary Ferguson
 * Last edited: 02/07/2015
 * Main JavaScript code for the game Kittens!
 */
 
window.onload = function() {
    
    "use strict";

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, "game", 
		{ preload: preload, create: create, update: update } );

	/* Tile map variable an layers */
	var desert_tilemap;
	var ground;
	var shrubs;
	var building1;
	var building2;
	var building3;	
	var door1;
	var door2;
	var door3;	
    var signs;
	var tree;
	
	var player;
	var player_speed = 256;
	
	/* Arrow key objects */
	var cursors;
	
	function preload() {
		/* Load tile map */
		game.load.image("desert", "assets/desert_tiled.png");
		game.load.image("desert_town", "assets/desert_town.png");
		game.load.image("doors", "assets/door.png");
		game.load.tilemap("desert_map", "assets/desert.json", null, Phaser.Tilemap.TILED_JSON);
		/* Load sprites */
		game.load.spritesheet("player", "assets/player.png", 34, 52);
	}
    
    
    function create() {
		/* Stretch out the world */
		game.world.setBounds(0, 0, 32*40, 32*40);
		
		/* Create tile map */
		desert_tilemap = game.add.tilemap("desert_map");
		desert_tilemap.addTilesetImage("desert_tiled", "desert");
		desert_tilemap.addTilesetImage("town1", "desert_town");
		desert_tilemap.addTilesetImage("door", "doors");
		ground = desert_tilemap.createLayer("ground");
		shrubs = desert_tilemap.createLayer("shrub");
		building1 = desert_tilemap.createLayer("building1");
		building2 = desert_tilemap.createLayer("building2");
		building3 = desert_tilemap.createLayer("building3");
		door1 = desert_tilemap.createLayer("door1");
		door2 = desert_tilemap.createLayer("door2");
		door3 = desert_tilemap.createLayer("door3");
		signs = desert_tilemap.createLayer("signs");
		
		desert_tilemap.setCollisionBetween(0, 175+48, true, building1);
		desert_tilemap.setCollisionBetween(0, 175+48, true, building2);
		desert_tilemap.setCollisionBetween(0, 175+48, true, building3);
		var shrub_indexs = [52,53,58,60,61,137,138,139,140,145,146,147,148];
		desert_tilemap.setCollision(shrub_indexs, true, shrubs);
		desert_tilemap.setCollision(45, true, signs);
		desert_tilemap.setCollision([224,225,226,227], true, door1);
		desert_tilemap.setCollision([224,225,226,227], true, door2);
		desert_tilemap.setCollision([224,225,226,227], true, door3);
		
		
		
		/* Create the player */
		create_player();
		/* Set the camera to follow the player */
		game.camera.follow(player);
		
		tree = desert_tilemap.createLayer("tree");
		
		desert_tilemap.setCollision([150], true, tree);
		
		/* Create the arrow keys */
		cursors = game.input.keyboard.createCursorKeys();
		
	}
    
		/* Creates the players character sprite */
	function create_player()
	{
		/* The player and its settings */
		player = game.add.sprite(592, game.world.height-52, "player");
	
		/* Enable physics on the player */
		game.physics.arcade.enable(player);
	
		/* Player physics properties. Give the little guy a slight bounce. */
		player.body.collideWorldBounds = true;
	
		/* Add player animations */
		player.animations.add( "left", [ 4,  5,  6,  7], 5, true);
		player.animations.add("right", [ 8,  9, 10, 11], 5, true);
		player.animations.add( "down", [ 1,  2,  3,  0], 5, true);
		player.animations.add(   "up", [12, 13, 14, 15], 5, true);
	}
	
    function update() {
		/**********************************************/
		/************Collision and Overlaps************/  
		/**********************************************/		
		
		/* Collision between player and building1 */
		game.physics.arcade.collide(player, building1);
		/* Collision between player and building2 */
		game.physics.arcade.collide(player, building2);
		/* Collision between player and building3 */
		game.physics.arcade.collide(player, building3);
		/* Collision between player and shrubs */
		game.physics.arcade.collide(player, shrubs);
		game.physics.arcade.collide(player, signs);
		game.physics.arcade.collide(player, tree);
		/* Collision between player and doors */
		game.physics.arcade.collide(player, door1, test);
		game.physics.arcade.collide(player, door2, test);
		game.physics.arcade.collide(player, door3, test);
		
		/* Reset the player's velocity */
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;

		
		/**********************************************/
		/*************** Player controls **************/  
		/**********************************************/
		
		/**************** Left or Right ***************/
		if(cursors.left.isDown)
		{
			/* Move to the left */
			player.body.velocity.x = -player_speed;
			player.animations.play("left");
		}
		else if(cursors.right.isDown)
		{
			/* Move to the right */
			player.body.velocity.x = player_speed;
			player.animations.play("right");
		}
		/***************** Up or Down *****************/
		else if(cursors.up.isDown)
		{
			/* Move to the right */
			player.body.velocity.y = -player_speed;
			player.animations.play("up");
		}
		else if(cursors.down.isDown)
		{
			/* Move to the right */
			player.body.velocity.y = player_speed;
			player.animations.play("down");
		}
		else
		{
			player.animations.stop();
			player.frame = 0;
		}
	}
	
	function test(p, door)
	{
		player.kill();
	}
};
