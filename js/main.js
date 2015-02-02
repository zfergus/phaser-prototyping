/*
 * Doggies!
 * Created by Zachary Ferguson
 * Last edited: 02/01/2015
 * Main JavaScript code for the game Doggies!
 *
 */
window.onload = function() {
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var d = new Date();
	var start = d.getTime();
	
    function preload() {
        /* Load the assets */
        game.load.image("sky", 'assets/sky.png' );
		game.load.image("ground", 'assets/ground-tile.png' );
		game.load.spritesheet("dude", "assets/dude_edited.png", 32, 48);
		game.load.spritesheet("baddie", "assets/baddie.png", 32, 32);
		game.load.image("bone", 'assets/bone.png' );
		game.load.image("ladder", 'assets/ladder.png' );
		game.load.image("ladder-large", 'assets/ladder_160.png' );
	}
    
    var platforms;
	var player;
	var cursors;
    var bones;
	var ladders;
	var boneCount;
	
    function create() 
	{
		/* Draw the world */
		game.add.sprite(0,0,"sky");
		
		/* Create the ground */
		create_ground();

		bones = game.add.group();
		bones.enableBody = true;
		create_bones(160, game.world.height-80);
		
		ladders = game.add.group();
		ladders.enableBody = true;
		create_ladder(240, game.world.height-120, "ladder");
		create_ladder(440, game.world.height-200, "ladder-large");
		
		/* Create the player */
		create_player();
		
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
		/* Reset the players velocity */
		player.body.velocity.x = 0;
		
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
		else
		{
			/* Stand still */
			player.animations.stop();
			player.frame = 4;
		}
	
		/* Allow the player to move up if they are touching the ladder */
		if(cursors.up.isDown && game.physics.arcade.overlap(player, ladders))
		{
			player.frame = 5;
			player.body.velocity.y = -100;
		}
		else{
			/* Collision between the player and the platforms */
			game.physics.arcade.collide(player, platforms);
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
};
