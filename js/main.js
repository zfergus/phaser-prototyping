/*
 * Doggies!
 * Created by Zachary Ferguson
 * Last edited: 02/03/2015
 * Main JavaScript code for the game Doggies!
 *
 */
window.onload = function() 
{
	"use strict";
	
	/* Class for the Dog enemy */
	var Dog = function(index, game, person, running_direction, type)
	{
		var x = (game.world.randomX%(game.world.bounds.width-120))+40;
		var y = (Math.random() * (game.world.height-80));
		
		/* Create normal type */
		if( type === 0)
		{
			this.speed = 300;
			this.damage = 5;
			this.type_string = "dog";
		}
		/* Create fast type */
		else if(type === 1)
		{
			this.speed = 450;
			this.damage = 1;
			this.type_string = "dog-fast";
		}
		/* Create heavy type */
		else
		{
			this.speed = 150;
			this.damage = 10;
			this.type_string = "dog-heavy";
		}
		
		this.running_direction = running_direction;
		this.game = game;
		this.bones_eaten = 0;
		this.player = player;
		this.alive = true;
		n_dogs++;

		this.dog = game.add.sprite(x, y, this.type_string);
		
		game.physics.arcade.enable(this.dog, Phaser.Physics.ARCADE);
		
		this.dog.body.bounce.y = 0.2;
		this.dog.body.gravity.y = 300;
		this.dog.body.collideWorldBounds = true;
		
		/* Walk left and right animations */
		this.dog.animations.add( "left", [0, 1], 10, true);
		this.dog.animations.add("right", [2, 3], 10, true);
		
		if(running_direction === 0)
			this.dog.frame = 1;
		else
			this.dog.frame = 2;
		
		this.dog.name = index.toString();
	}
	
	/* Feed a bone to this dog and tame it */
	Dog.prototype.feed_bone = function()
	{
		/* If the player has more than 1 bone */
		if(n_bones > 0)
		{
			/* Take away a bone */
			n_bones -= 1;
			/* Give bone to dog */
			this.bones_eaten += 1;
			
			/* Play bark sound */
			bark.play("", 0, 5, false);
			
			/* Tame this dog */
			this.alive = false;
			this.dog.kill();
			n_dogs--;
			create_heart(this.dog.x, this.dog.y);
			
			/* Update the status text */
			redraw_text();
		}
	};
    
	/* The game object */
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, "game", 
		{ preload: preload, create: create, update: update } );
    
	/* Load the game assets. */
    function preload() 
	{
        /* Load the assets */
		game.load.image("ground", "assets/ground-tile.png");
		game.load.image("wall", "assets/wall.png");
		game.load.image("bone", "assets/bone.png");
		//game.load.image("med", "assets/stimpak.png");
		game.load.image("ladder-huge", "assets/ladder-huge.png");
		game.load.image("ladder-large", "assets/ladder-large.png");
		
		/* Load Sprites */
		game.load.spritesheet("sky", "assets/sky.png", 800, 600);
		game.load.spritesheet("dude", "assets/dude_edited.png", 32, 48);
		game.load.spritesheet("dog", "assets/dog.png", 32, 32);
		game.load.spritesheet("dog-fast", "assets/dog-fast.png", 32, 32);
		game.load.spritesheet("dog-heavy", "assets/dog-heavy.png", 32, 32);
		game.load.spritesheet("heart", "assets/heart-sheet.png", 22, 22);
		
		/* Load Music */
		game.load.audio("day-music", "assets/day.mp3");
		game.load.audio("night-music", "assets/night.mp3");
		game.load.audio("howl", "assets/howl.wav");
		game.load.audio("ouch", "assets/ouch.mp3");
		game.load.audio("bark", "assets/bark.mp3");
	}
	
	/* A date object for getting the time */
	var startTime = (new Date()).getTime();
	/* Boolean for if it is night */
	var isNight = false;
	
	/* Group for the ground and ledges */
    var platforms;
	/* Group for the wall bricks */
    var walls;
	/* The players character */
	var player;
	/* Array of dogs in the world */
	var dogs;
	/* Group of all the bones in the world */
    var bones;
	/* Ladders in the game */
	var ladders;
	/* Sprite for the sky */
	var sky;
	
	/* Arrow key objects */
	var cursors;
	
	/* Music player for background music */
	var day_music;
	var night_music;
	/* Howl sound effect */
	var howl;
	/* Ouch sound effect */
	var ouch;
	/* Dog bark sound effect */
	var bark;
	
	/* Text for the bone count and player's health */
	var status
	
	/* Number of bones the player collected */
	var n_bones = 0;	
	/* Player's current health */
	var health = 100;
	/* Number of dogs in the world */
	var n_dogs = 0;
	
    function create() 
	{
		/* Stretch out the world */
		game.world.setBounds(0, 0, 8000, 600);
		
		/* Play day song */
		day_music = game.add.audio("day-music",1,true);
		night_music = game.add.audio("night-music",1,true);
		day_music.play("",0,1,true);
		
		/* Load howl */
		howl = game.add.audio("howl", 1, true);
		
		/* Load ouch sound effect */
		ouch = game.add.audio("ouch", 1, true);
		
		/* Load bark */
		bark = game.add.audio("bark", 1, true);


		/* Draw the sky */
		sky = game.add.sprite(0, 0, "sky");
		sky.fixedToCamera = true;
		
		/* Create the ground */
		create_platform();
		
		/* Create boundary walls */
		create_walls();

		/* Create the bones of the world */
		bones = game.add.group();
		bones.enableBody = true;
		create_bone(160, game.world.height-80);
		
		/* Creates ladders in the world */
		ladders = game.add.group();
		ladders.enableBody = true;
		create_ladder(560, 400, "ladder-large");
		create_ladder(740, 240, "ladder-large");
		create_ladder(740, 160, "ladder-large");
		
		/* Create ladders spaced 400 pixels apart */
		for(var i = 1200; i < game.world.bounds.width; i+= 400)
		{
			create_ladder(i, 160, "ladder-huge");
		}
		
		/* Create the player */
		create_player();
		/* Set the camera to follow the player */
		game.camera.follow(player);
		
		/* Create the 25 initial dogs */
		dogs = [];
		create_dogs(25);
		
		/* Create the arrow keys */
		cursors = game.input.keyboard.createCursorKeys();
		
		/* Text to display the bone count and health */
		status = game.add.text(player.x+20,  player.y-20, "Health: " + 
			health + "\nBones: " + n_bones, { fontSize: "72px", fill: "#fff", font: "courier"});
		status.align = "center"
		
    }
	
	/* Creates the ground and some platforms to jump on */
	function create_platform()
	{
		platforms = game.add.group();
		platforms.enableBody = true;
		
		/* Create the ground */
		for(var x = 0; x < game.world.width; x += 40)
		{
			var ground = platforms.create(x, game.world.height - 40, "ground");
			ground.body.immovable = true;
		}
		
		/* Create the first level */
		for(var x = 0; x < game.world.width; x += 40)
		{
			var ledge = platforms.create(x, game.world.height - 200, "ground");
			ledge.body.immovable = true;
		}
		
		/* Create the second level */
		for(var x = 0; x < game.world.width; x += 40)
		{
			var ledge = platforms.create(x, game.world.height - 440, "ground");
			ledge.body.immovable = true;
		}
	}
	
	/* Creates wall tiles at the edges of the world */
	function create_walls()
	{
		/* Initializes the wall group */
		walls = game.add.group();
		walls.enableBody = true;
		
		/* Create the left wall */
		for(var y = 0; y < (game.world.height-40); y += 40)
		{
			var wall = walls.create(0, y, "wall");
			wall.body.immovable = true;
		}
		
		/* Create the right wall */
		for(var y = 0; y < (game.world.height-40); y += 40)
		{
			var wall = walls.create(game.world.bounds.width - 40, y, "wall");
			wall.body.immovable = true;
		}
	}
	
	/* Creates the players character sprite */
	function create_player()
	{
		/* The player and its settings */
		player = game.add.sprite(40, game.world.height - 150, "dude");
	
		/* Enable physics on the player */
		game.physics.arcade.enable(player);
	
		/* Player physics properties. Give the little guy a slight bounce. */
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
	
		/* Add player animations */
		player.animations.add( "left", [0, 1, 2, 3], 10, true);
		player.animations.add("right", [6, 7, 8, 9], 10, true);
		player.animations.add("climb", [10, 11], 5, true);
		
	}
	
	/* Creates n dogs where n is the given integer. */
	/* Creates the dogs at random coordinates.      */
	function create_dogs(n_dogs)
	{
		for(var i = 0; i < n_dogs; i++)
		{
			var dog;
			do
			{
				var dog = new Dog(i, game, player, i%2, i%3);
			}
			while(game.physics.arcade.overlap(platforms, dogs))
			dogs.push(dog);
		}
	}
	
	/* Creates a bone at the x and y coordinates given. */
	function create_bone(x, y)
	{
		var bone = bones.create(x, y, "bone");
		game.physics.arcade.enable(bone);
		
		/* Add physics so the bones fall */
		bone.body.bounce.y = 0.2;
		bone.body.gravity.y = 300;
		bone.body.collideWorldBounds = true;
	}
	
	/* Creates a ladder at the x and y coordinates given. */
	function create_ladder(x, y, type)
	{
		var ladder = ladders.create(x, y, type);
		ladder.body.immovable = true;
	}
	
	/* Creates a heart particle at the given x and y */
	function create_heart(x, y)
	{
		var heart = game.add.sprite(x, y, "heart", 0);
		
		/* Play beating heart animation and kill afterwards */
		heart.animations.add("beat", [0, 1, 2, 3], 4, true);
		heart.animations.play("beat", 8, false, true);
	}
	
	/* Run this every frame */
	function update()
	{	
		/* Move the text */
		redraw_text();
		
		/**********************************************/
		/************Collision and Overlaps************/  
		/**********************************************/
		
		/* Collision between player and walls */
		game.physics.arcade.collide(walls, player);
		/* Check overlap of bone and player */
		game.physics.arcade.overlap(player, bones, collect_bone, null, this);
		/* Collision between bone and ground */
		game.physics.arcade.collide(bones, platforms);
		/* Collision between bone and ground */
		player.body.velocity.x = 0;
		
		/**********************************************/
		/* Detect Collisions and Events with the Dogs */  
		/**********************************************/
		
		/* Collision between dogs and other */
		for (var i = 0; i < dogs.length; i++)
		{
			if(dogs[i].alive)
			{
				/* Collision between the dog and ground */
				game.physics.arcade.collide(platforms, dogs[i].dog);
				/* Collision between the dog and walls */
				var colliding = game.physics.arcade.collide(dogs[i].dog, walls);
				if(isNight)
				{
					if(game.physics.arcade.overlap(player, dogs[i].dog))
					{
						damagePlayer(dogs[i].damage);
					}
					if(colliding)
					{
						if(dogs[i].running_direction === 0)
						{
							/* Move to the right */
							dogs[i].dog.body.velocity.x = dogs[i].speed;
							dogs[i].dog.animations.play("right");
							dogs[i].running_direction = 1;
						}
						else
						{
							/* Move to the left */
							dogs[i].dog.body.velocity.x = -(dogs[i].speed);
							dogs[i].dog.animations.play("left");
							dogs[i].running_direction = 0;
						}
					}
				}
				else
				{	
					if(game.physics.arcade.overlap(player, dogs[i].dog))
					{
						dogs[i].feed_bone();
					}
				}
			}
		}
		
		
		/**********************************************/
		/*************** Player controls **************/  
		/**********************************************/
		
		/**************** Left or Right ***************/
		
		if(cursors.left.isDown)
		{
			/* Move to the left */
			player.body.velocity.x = -300;
			player.animations.play("left");
		}
		else if(cursors.right.isDown)
		{
			/* Move to the right */
			player.body.velocity.x = 300;
			player.animations.play("right");
		}
		/* If all the cursors are NOT down */ 
		else if(!((cursors.up.isDown ||  cursors.down.isDown) && 
				game.physics.arcade.overlap(player, ladders)))
		{
			/* Stand still */
			player.animations.stop();
			player.frame = 4;
		}
		
		/***************** Up or Down *****************/
		
		/* Allow the player to move up if they are touching the ladder */
		if(cursors.up.isDown && game.physics.arcade.overlap(player, ladders))
		{
			/* Climb animation */
			player.animations.play("climb");
			/* Move up */
			player.body.velocity.y = -100;
		}
		/* Allow the player to move down if they are touching the ladder */
		else if(cursors.down.isDown && 
				game.physics.arcade.overlap(player, ladders) && 
				player.y < game.world.height-90)
		{
			/* Climb animation */
			player.animations.play("climb");
			/* Move down */
			player.body.velocity.y = 100;
		}
		/* Turns collision with ground on if not on a ladder */
		else
		{
			/* Collision between the player and the platforms */
			game.physics.arcade.collide(player, platforms);
		}
		
		/**********************************************/
		/******* Control the Day and Night Cycle ******/  
		/**********************************************/
		
		/* If 30 sec have elapsed switch the day or night */
		if(((new Date()).getTime() - startTime)/1000 >= 30)
		{
			change_time();
		}
	}
	
	/* Collect the given bone */
	function collect_bone(p, bone)
	{
		/* Moves the the bone to a random point */
		bone.reset(Math.random()*game.world.width, 
				   Math.random()*(game.world.height - 80));
	 
		/* Add an update the number of bones collected */
		n_bones += 1;
		redraw_text();
	}
	
	/* Deal the given damage to the player's health */
	function damagePlayer(damage)
	{
		health -= damage;
		ouch.play("", 0, 10, false);
		if(health <= 0)
		{
			health = 0;
			reset_game();
		}
	}
	
	/* Redraw the text relative to the camera */
	function redraw_text()
	{
		status.text = "Health: " + health + "\nBones: " + n_bones + "  Dogs: "
		+ n_dogs;
		status.x = player.x-30;
		status.y = player.y-25;
	}

	/* End the game kill the player */
	function reset_game() 
	{
		/* Move the player back to the spawn point */
		player.reset(40, game.world.height - 150);
		/* Reset the player's health */
		health = 100;
		/* Reset the player's inventory */
		n_bones = 0;
		/* Create an additional 10 dogs */
		create_dogs(10);
		
		/* Move the camera to the origin */
		game.world.camera.x = 0;
		game.world.camera.y = 0;
		
		/* Redraw the text */
		redraw_text();
		change_time();
	}

	/* Switch from day to night or night to day depending on what the */
	/* current state is.                                              */
	function change_time()
	{
		if(!isNight) /* If it is day time */
		{
			howl.play("", 0, 10, false);
			/* Change to night time */
			document.body.style.background = "black";
			/* Change the music */
			day_music.pause("",0,1,true);
			night_music.play("",0,1,true);
			/* Change the background */
			sky.frame = 1;
			
			for (var i = 0; i < dogs.length; i++)
			{
				if(dogs[i].alive)
				{
					if(dogs[i].running_direction === 0)
					{
						/* Move to the left */
						dogs[i].dog.body.velocity.x = -(dogs[i].speed);
						dogs[i].dog.animations.play("left");
						dogs[i].running_direction = 1;
					}
					else
					{
						/* Move to the right */
						dogs[i].dog.body.velocity.x = dogs[i].speed;
						dogs[i].dog.animations.play("right");
						dogs[i].running_direction = 0;
					}
				}	
			}
			isNight = true;
		}
		else /* If it is night time */
		{
			/* Change to day time */
			document.body.style.background = "white";
			/* Change the music */
			night_music.pause("",0,1,true);
			day_music.play("",0,1,true);
			/* Change the background */
			sky.frame = 0;
			
			for (var i = 0; i < dogs.length; i++)
			{					
				if(dogs[i].alive)
				{
					dogs[i].dog.body.velocity.x = 0;
					dogs[i].dog.animations.stop();
					if(dogs[i].running_direction === 0)
					{
						/* Stand facing left */
						dogs[i].dog.frame = 1;
					}
					else
					{
						/* Stand facing right */
						dogs[i].dog.frame = 2;
					}
				}
			}
			
			isNight = false;
		}
			
		startTime = (new Date()).getTime();
	}
};
