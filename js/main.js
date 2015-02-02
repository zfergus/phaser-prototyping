/*
 * Doggies!
 * Created by Zachary Ferguson
 * Last edited: 02/01/2015
 * Main JavaScript code for the game Doggies!
 *
 */
window.onload = function() {
    "use strict";
    
	/* The game object */
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
	/* A date object for getting the time */
	var startTime = (new Date()).getTime();
	var isNight = false;
	
	/* Load the game assets. */
    function preload() {
        /* Load the assets */
		game.load.image("sky-night", 'assets/sky-night.png');
		game.load.image("ground", 'assets/ground-tile.png');
		game.load.image("bone", 'assets/bone.png');
		game.load.image("ladder", 'assets/ladder.png');
		game.load.image("ladder-large", 'assets/ladder_160.png');
		
		/* Load Sprites */
		game.load.spritesheet("sky", "assets/sky.png", 800, 600);
		game.load.spritesheet("dude", "assets/dude_edited.png", 32, 48);
		game.load.spritesheet("baddie", "assets/baddie.png", 32, 32);
		
		/* Load Music */
		game.load.audio("day-music", 'assets/day.mp3' );
		game.load.audio("night-music", 'assets/night.mp3' );
		
	}
    
	/* Group for the ground and ledges */
    var platforms;
	/* The players character */
	var player;
	/* The dogs in the world */
	var baddies;
	/* Arrow key objects */
	var cursors;
	/* Group of all the bones in the world */
    var bones;
	/* Ladders in the game */
	var ladders;
	
	/* Music player for background music */
	var music;
	
	/* Text for the bone count the player has collected */
	var boneCount;
	
	/* Sprite for the sky */
	var sky;
	
    function create() 
	{
		/* Play day song */
		music = game.add.audio('day-music',1,true);
		music.play('',0,1,true);
		
		/* Draw the sky */
		sky = game.add.sprite(0, 0, "sky");
		
		/* Create the ground */
		create_ground();

		bones = game.add.group();
		bones.enableBody = true;
		create_bones(160, game.world.height-80);
		
		/* Creates ladders in the world */
		ladders = game.add.group();
		ladders.enableBody = true;
		create_ladder(560, game.world.height-200, "ladder-large");
		create_ladder(740, game.world.height-360, "ladder-large");
		create_ladder(740, game.world.height-440, "ladder-large");
		
		/* Create the player */
		create_player();
		
		/* Create the dogs */
		baddies = game.add.group();
		baddies.enableBody = true;
		create_dog(0, 0);
		
		/* Create the arrow keys */
		cursors = game.input.keyboard.createCursorKeys();
		
		/* Display number of bones */
		boneCount = game.add.text(16, 16, "Bones: 0", { fontSize: "32px", fill: "#000"});
    }
	
	/* Creates the ground and some platforms to jump on */
	function create_ground()
	{
		platforms = game.add.group();
		platforms.enableBody = true;
		
		/* Create the ground */
		for(var i = 0; i < (game.world.width / 40); i++)
		{
			var ground = platforms.create(i*40, game.world.height - 40, "ground");
			ground.body.immovable = true;
		}
		
		/* Create the first ledge */
		for(var i = 400; i < game.world.width; i+=40)
		{
			var ledge = platforms.create(i, 400, "ground");
			ledge.body.immovable = true;
		}
		
		/* Create the second ledge */
		for(var i = 0; i < (160 / 40); i++)
		{
			var ledge = platforms.create(i*40, 250, "ground");
			ledge.body.immovable = true;
		}
		
		/* Create the first ledge */
		for(var i = 280; i < game.world.width; i+=40)
		{
			var ledge = platforms.create(i, 160, "ground");
			ledge.body.immovable = true;
		}
	}
	
	/* Creates the players character sprite */
	function create_player()
	{
		/* The player and its settings */
		player = game.add.sprite(32, game.world.height - 150, "dude");
	
		/* Enable physics on the player */
		game.physics.arcade.enable(player);
	
		/* Player physics properties. Give the little guy a slight bounce. */
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
	
		/* Walk left and right animations */
		player.animations.add( "left", [0, 1, 2, 3], 10, true);
		player.animations.add("right", [6, 7, 8, 9], 10, true);
		player.animations.add("climb", [10, 11], 5, true);
		
	}
	
	/* Creates a dog at the given x and y coordinates. */
	function create_dog(x, y)
	{
		var doggie = baddies.create(0, 0, "baddie");
		game.physics.arcade.enable(doggie);
		doggie.body.gravity.y = 300;
		doggie.body.collideWorldBounds = true;
		
		/* Walk left and right animations */
		doggie.animations.add( "left", [0, 1], 10, true);
		doggie.animations.add("right", [2, 3], 10, true);
		
		doggie.frame = 2;
	}
	
	/* Creates a bone at the x and y coordinates given. */
	function create_bones(x, y)
	{
		var bone = bones.create(x, y, "bone");
		bone.body.immovable = true;
	}
	
	/* Creates a ladder at the x and y coordinates given. */
	function create_ladder(x, y, type)
	{
		var ladder = ladders.create(x, y, type);
		ladder.body.immovable = true;
	}
	
	function update()
	{
		/* Check overlap of bone and player */
		game.physics.arcade.overlap(player, bones, collect_bone, null, this);
		/* Collision between dogs and ground */
		game.physics.arcade.collide(baddies, platforms);
		/* Reset the players velocity */
		player.body.velocity.x = 0;
		
//		if(isNight)
//		{
//			/* Move to the left */
//			baddies.body.velocity.x = -150;
//			baddies.animations.play("left");
//			game.physics.arcade.overlap(player, baddies, damagePlayer);
//		}
	
		if(cursors.left.isDown)
		{
			/* Move to the left */
			player.body.velocity.x = -150;
			player.animations.play("left");
		}
		else if(cursors.right.isDown)
		{
			/* Move to the right */
			player.body.velocity.x = 150;
			player.animations.play("right");
		}
		else if(!(cursors.up.isDown && game.physics.arcade.overlap(player, ladders)))
		{
			/* Stand still */
			player.animations.stop();
			player.frame = 4;
		}
	
		/* Allow the player to move up if they are touching the ladder */
		if(cursors.up.isDown && game.physics.arcade.overlap(player, ladders))
		{
			player.animations.play("climb");
			player.body.velocity.y = -100;
		}
		else{
			/* Collision between the player and the platforms */
			game.physics.arcade.collide(player, platforms);
		}
		
		boneCount.text = ((new Date()).getTime() - startTime)/1000;
		
		if(((new Date()).getTime() - startTime)/1000 >= 30)
		{
			if(!isNight) /* If it is day time */
			{
				/* Change to night time */
				document.body.style.background = "black";
				isNight = true;
				music.stop('',0,1,true);
				music = game.add.audio('night-music',1,true);
				music.play('',0,1,true);
				sky.frame = 1;
			}
			else /* If it is night time */
			{
				/* Change to day time */
				document.body.style.background = "white";
				isNight = false;
				/* Play day song */
				music.stop('',0,1,true);
				music = game.add.audio('day-music',1,true);
				music.play('',0,1,true);
				sky.frame = 0;
			}
			startTime = (new Date()).getTime();
		}
	}
	
	var n_bones = 0;
	function collect_bone(person, bone)
	{
		/* Removes the star from the screen */
		bone.kill();
	 
		/* Add an update the score */
		n_bones += 1;
		boneCount.text = "Bones: " + n_bones;
	}
	
	var health = 100;
	function damagePlayer()
	{
		health -= 50;
		if(health <= 0)
		{
			player.kill();
		}
	}
};
