function OverworldState() {
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
	var player_speed;
	
	/* NPC's */
	var nesha;
	var preist;
	var clyde;
	var cleo;
	var mage;
	
	/* World text */
	var door_text;
	var sign_text;
	var kittens_text;
	
	/* Arrow key objects */
	var cursors;
	
	var clueOneFound;
	var clueTwoFound;
	var kittensAdded;
	var kittensFound;
	var meow;
	var kittensX = Math.random() * 1024;
	var kittensY = Math.random() * 1024;
	var box;
	
	/* SFX */
	var ouch;
};

OverworldState.prototype = 
{	
	create: function() 
	{
		/* Define variables */
		player_speed = 256;
		
		clueOneFound = false;
		clueTwoFound = false;
		kittensAdded = false;
		kittensFound = false;
		kittensX = Math.random() * 1024;
		kittensY = Math.random() * 1024;
	
		this.startTime = 0;
		this.deltaTime = 0;
	
		ouch = this.game.add.audio("ouch", 0.025, false);
	
		/* Stretch out the world */
		this.game.world.setBounds(0, 0, 1280, 1280);
		
		/* Create tile map */
		desert_tilemap = this.game.add.tilemap("desert_map");
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
		this.create_player();
		/* Set the camera to follow the player */
		this.game.camera.follow(player);
		
		tree = desert_tilemap.createLayer("tree");
		var tree_indices = [61, 145, 146, 147, 148, 150];
		desert_tilemap.setCollision(tree_indices, true, tree);
		
		/* Create NPC's */
		preist = new NonPlayerCharacter(818, 480, this.game, "npc2", "Priest: May God have mercy on your soul.");
		cleo = new NonPlayerCharacter(634, 352, this.game, "female_npc", "Cleo: Ohh...I hope you find those kittens.");
		clyde = new NonPlayerCharacter(442, 480, this.game, "npc1", "Clyde: Kittens...hmm...\n" +
			"I don't think I have seen any kittens lately, but\n" + 
			"we did get a new shipment of livestock.");
		mage = new NonPlayerCharacter(672 + 64, 248, this.game, "npc3", "Mage: How dare you accuse me!");
		nesha = new NonPlayerCharacter(kittensX, kittensY-64, this.game, "nesha", "Princess: Thank you for saving my kittens!");
		nesha.npc.visible = false;
		
		/* Create the arrow keys */
		cursors = this.game.input.keyboard.createCursorKeys();
		
		/* Create the world text */
		door_text = this.game.add.text(player.x - 48, player.y - 48, "", 
			{fill: "red", font: "12px Courier New", align: "center"});	
		sign_text = this.game.add.text(player.x - 48, player.y - 48, "", 
			{fill: "black", font: "12px Courier New", align: "center"});	
		kittens_text = this.game.add.text(player.x - 48, player.y - 48, "", 
			{fill: "blue", font: "12px Courier New", align: "center"});
	},
	
	/* Creates the players character sprite */
	create_player: function()
	{
		/* The player and its settings */
		player = this.game.add.sprite(592, this.game.world.height-52, "player");
	
		/* Enable physics on the player */
		this.game.physics.arcade.enable(player);
	
		/* Player physics properties. Give the little guy a slight bounce. */
		player.body.collideWorldBounds = true;
	
		/* Add player animations */
		player.animations.add( "left", [ 4,  5,  6,  7], 5, true);
		player.animations.add("right", [ 8,  9, 10, 11], 5, true);
		player.animations.add( "down", [ 1,  2,  3,  0], 5, true);
		player.animations.add(   "up", [12, 13, 14, 15], 5, true);
	},
	
	/* Update the game every frame */
    update: function() 
	{

		if(nesha.npc.visible && this.deltaTime > 5*1000)
		{
			
			console.warn("true");
			nesha.mute();
			nesha.npc.visible = false;
		}
		else
		{
			this.deltaTime = (new Date()).getTime() - this.startTime;
		}
		
		//console.log("X: "+player.x+", Y: "+player.y);
		
		/**********************************************/
		/************Collision and Overlaps************/  
		/**********************************************/		
		
		if(kittensAdded && this.game.physics.arcade.collide(box, player))
		{
			meow.stop();
			this.display_kittens_text();
			
			/* Display Angel */
			if(!kittensFound)
			{
				nesha.npc.visible = true;
				nesha.speak();
				this.startTime = (new Date()).getTime();
				this.deltaTime = (new Date()).getTime() - this.startTime;
			}
			
			kittensFound = true;
		}
		else
		{
			kittens_text.text = "";
		}
			
		/* Collision between player and buildings */
		this.game.physics.arcade.collide(player, buildings);
		/* Collision between player and shrubs */
		if(this.game.physics.arcade.collide(player, shrubs) && !ouch.isPlaying )
		{
			ouch.play();
		}
		if(this.game.physics.arcade.collide(player, signs))
		{
			this.display_sign_text();
		}
		else
		{
			sign_text.text = "";
		}
		if(this.game.physics.arcade.collide(player, tree) && !ouch.isPlaying )
		{
			ouch.play();
		}
		/* Collision between player and doors */
		if(this.game.physics.arcade.collide(player, door1) ||
		   this.game.physics.arcade.collide(player, door2) ||
		   this.game.physics.arcade.collide(player, door3))
		{
			this.display_door_text();
		}
		else
		{
			door_text.text = "";
		}
		/* Collision between NPC and player */
		if(this.game.physics.arcade.collide(player, preist.npc))
		{
			preist.speak();
			preist.stop(player.x);
		}
		else
		{
			preist.mute();
			preist.move();
		}
		if(this.game.physics.arcade.collide(player, cleo.npc))
		{
			cleo.speak();
			cleo.stop(player.x);
			console.log("Clue found, YAY!!!");
			clueOneFound = true;
		}
		else
		{
			cleo.mute();
			cleo.move();
		}		
		if(this.game.physics.arcade.collide(player, mage.npc))
		{
			mage.speak();
			mage.stop(player.x);
		}
		else
		{
			mage.mute();
			mage.move();
		}		
		if(this.game.physics.arcade.collide(player, clyde.npc))
		{
			clyde.speak();
			clyde.stop(player.x);
			console.log("Clue found, YAY!!!");
			clueTwoFound = true;
		}
		else
		{
			clyde.mute();
			clyde.move();
		}
		/* Reset the player's velocity */
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;

		/**********************************************/
		/***************** Add Kittens ****************/  
		/**********************************************/
		if(clueOneFound && clueTwoFound && !kittensAdded && !kittensFound)
		{
			this.addKittens();
			kittensAdded = true;
		}
		
		if(kittensAdded && !kittensFound)
		{
			meow.volume = (50/(this.playerDistance(kittensX, kittensY)+1));
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
	},
	
	display_door_text: function()
	{
		door_text.text = "This door is locked.";
		door_text.x = player.x - 48;
		door_text.y = player.y - 64;
	},
	
	display_sign_text: function()
	{
		sign_text.text = "This is a sign.";
		sign_text.x = player.x - 48;
		sign_text.y = player.y - 16;	
	},
	
	display_kittens_text: function()
	{
		kittens_text.text = "You found the kittens,\nYAY!!!"
		kittens_text.x = box.x - 48;
		kittens_text.y = box.y - 32;
		console.log("Kittens found, YAY!!!");
	},
	
	addKittens: function()
	{
		box = this.game.add.sprite(kittensX, kittensY, "kittens");
		this.game.physics.arcade.enable(box, Phaser.Physics.ARCADE);
		this.game.physics.arcade.enable(box);
		box.body.immovable = true;
		/* Play meow sound */
		meow = this.game.add.audio("meow", 1, true);
		meow.play();
	},
	
	playerDistance: function(objectX, objectY)
	{
		var deltaX = Math.abs(objectX-player.x);
		var deltaY = Math.abs(objectY-player.y);
	
		var dist = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
		
		return dist;
	}
};