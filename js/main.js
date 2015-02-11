/*
 * Kittens!
 * Created by Zachary Ferguson
 * Last edited: 02/07/2015
 * Main JavaScript code for the game Kittens!
 */
 
window.onload = function() {
    
    "use strict";

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, "game", 
		{ preload: preload, create: create, update: update} );

	/* Tile map variable an layers */
	var desert_tilemap;
	var ground;
	var shrubs;
	var buildings;
	var door1;
	var door2;
	var door3;	
    var signs;
	var tree;
	
	var player;
	var player_speed = 256;
	
	/* NPC's */
	var nesha;
	
	/* World text */
	var door_text;
	var sign_text;
	var kittens_text;
	
	/* Arrow key objects */
	var cursors;
	
	var clueFound = false;
	var kittensAdded = false;
	var kittensFound = false;
	var meow;
	var kittensX = 64;
	var kittensY = 64;
	var box;
	
	function preload() 
	{
		/* Load tile map */
		game.load.image("desert", "assets/desert_tiled.png");
		game.load.image("desert_town", "assets/desert_town.png");
		game.load.image("doors", "assets/door.png");
		game.load.tilemap("desert_map", "assets/desert.json", null, Phaser.Tilemap.TILED_JSON);
		/* Load images */
		game.load.image("kittens", "assets/kittens.png");
		/* Load sprites */
		game.load.spritesheet("player", "assets/player.png", 34, 52);
		game.load.spritesheet("nesha", "assets/nesha.png", 34, 52);
		/* Load Sounds */
		game.load.audio("meow", "assets/kittens.wav");
	}
    
    
    function create() 
	{
		/* Stretch out the world */
		game.world.setBounds(0, 0, 1280, 1280);
		
		/* Create tile map */
		desert_tilemap = game.add.tilemap("desert_map");
		desert_tilemap.addTilesetImage("desert_tiled", "desert");
		desert_tilemap.addTilesetImage("town1", "desert_town");
		desert_tilemap.addTilesetImage("door", "doors");
		ground    = desert_tilemap.createLayer("ground");
		shrubs    = desert_tilemap.createLayer("shrub");
		buildings = desert_tilemap.createLayer("buildings");
		door1     = desert_tilemap.createLayer("door1");
		door2     = desert_tilemap.createLayer("door2");
		door3     = desert_tilemap.createLayer("door3");
		signs     = desert_tilemap.createLayer("signs");
		
		desert_tilemap.setCollisionBetween(150, 224, true, buildings);
		//desert_tilemap.setCollisionByExclusion([58], true, buildings);
		var shrub_indices = [52, 58, 60];
		desert_tilemap.setCollision(    shrub_indices, true, shrubs);
		desert_tilemap.setCollision(               46, true, signs);
		desert_tilemap.setCollision([224,225,226,227], true, door1);
		desert_tilemap.setCollision([224,225,226,227], true, door2);
		desert_tilemap.setCollision([224,225,226,227], true, door3);
		
		
		
		/* Create the player */
		create_player();
		/* Set the camera to follow the player */
		game.camera.follow(player);
		
		nesha = new NPC(640, 640, game, "nesha", "Hi, have some cake?");
		
		tree = desert_tilemap.createLayer("tree");
		var tree_indices = [61, 145, 146, 147, 148, 150];
		desert_tilemap.setCollision(tree_indices, true, tree);
		
		/* Create the arrow keys */
		cursors = game.input.keyboard.createCursorKeys();
		
		/* Create the world text */
		door_text = game.add.text(player.x - 48, player.y - 48, "", 
			{fill: "red", font: "12px Courier New", align: "center"});	
		sign_text = game.add.text(player.x - 48, player.y - 48, "", 
			{fill: "black", font: "12px Courier New", align: "center"});	
		kittens_text = game.add.text(player.x - 48, player.y - 48, "", 
			{fill: "blue", font: "12px Courier New", align: "center"});	
		
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
		
		if(kittensAdded && 
			game.physics.arcade.collide(box, player))
		{
			meow.stop();
			display_kittens_text();
			kittensFound = true;
		}
		else
		{
			kittens_text.text = "";
		}
			
		/* Collision between player and buildings */
		game.physics.arcade.collide(player, buildings);
		/* Collision between player and shrubs */
		game.physics.arcade.collide(player, shrubs);
		if(game.physics.arcade.collide(player, signs))
		{
			display_sign_text();
		}
		else
		{
			sign_text.text = "";
		}
		game.physics.arcade.collide(player, tree);
		/* Collision between player and doors */
		if(game.physics.arcade.collide(player, door1) ||
		   game.physics.arcade.collide(player, door2) ||
		   game.physics.arcade.collide(player, door3))
		{
			display_door_text();
		}
		else
		{
			door_text.text = "";
		}
		/* Collision between NPC and player */
		if(game.physics.arcade.collide(player, nesha.npc))
		{
			nesha.speak();
			clueFound = true;
		}
		else
		{
			nesha.mute();
		}
		/* Reset the player's velocity */
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;

		/**********************************************/
		/***************** Add Kittens ****************/  
		/**********************************************/
		if(clueFound && !kittensAdded && !kittensFound)
		{
			addKittens();
			kittensAdded = true;
		}
		
		if(kittensAdded && !kittensFound)
		{
			meow.volume = (50/(playerDistance(kittensX, kittensY)+1));
			console.log(meow.volume);
		}
		
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
	
	function display_door_text()
	{
		door_text.text = "This door is locked.";
		door_text.x = player.x - 48;
		door_text.y = player.y - 64;
	}
	
	function display_sign_text()
	{
		sign_text.text = "This is a sign.";
		sign_text.x = player.x - 48;
		sign_text.y = player.y - 16;	
	}
	
	function display_kittens_text()
	{
		kittens_text.text = "You have found the kittens,\nYAY!!!"
		kittens_text.x = box.x - 48;
		kittens_text.y = box.y - 32;
		//console.log("Kittens found, YAY!!!")
	}
	
	function addKittens()
	{
		box = game.add.sprite(kittensX, kittensY, "kittens");
		game.physics.arcade.enable(box, Phaser.Physics.ARCADE);
		game.physics.arcade.enable(box);
		box.body.immovable = true;
		/* Play meow sound */
		meow = game.add.audio("meow", 1, true);
		meow.play();
		console.log("Clue found, YAY!!!");
	}
	
	function playerDistance(objectX, objectY)
	{
		var deltaX = Math.abs(objectX-player.x);
		var deltaY = Math.abs(objectY-player.y);
	
		var dist = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
		
		return dist;
	}
};
