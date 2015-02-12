function PreloadState() {};

PreloadState.prototype = 
{
	preload: function()
	{ 
		var loadingBar = this.add.sprite(400,300,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);
		  
		/* Load tile map */
		this.game.load.image("desert", "assets/desert_tiled.png");
		this.game.load.image("desert_town", "assets/desert_town.png");
		this.game.load.image("doors", "assets/door.png");
		this.game.load.tilemap("desert_map", "assets/desert.json", null, Phaser.Tilemap.TILED_JSON);
		/* Load images */
		this.game.load.image("kittens", "assets/kittens.png");
		this.game.load.image("text_box", "assets/text_box.png");
		/* Load sprites */
		this.game.load.spritesheet("player", "assets/player.png", 34, 52);
		this.game.load.spritesheet("nesha", "assets/nesha.png", 34, 52);
		this.game.load.spritesheet("npc1", "assets/npc1.png", 34, 52);
		this.game.load.spritesheet("npc2", "assets/npc2.png", 34, 52);
		this.game.load.spritesheet("npc3", "assets/npc3.png", 34, 52);
		this.game.load.spritesheet("female_npc", "assets/female_npc.png", 34, 52);
		this.game.load.spritesheet("title", "assets/intro.png", 800, 600);
		
		/* Load Sounds */
		this.game.load.audio("meow", "assets/kittens.ogg");
		this.game.load.audio("bg_music", "assets/bg_music.ogg");
	},
	create: function()
	{
		this.game.state.start("intro")
	}
};