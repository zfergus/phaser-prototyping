/*
 * SpaceSim: PreloadState.js
 * Created by Zachary Ferguson
 * Game State Class for preloading game assets
 */

"use strict";

function PreloadState() {};

PreloadState.prototype = {
    /* Load assets */
    preload: function() {
        /* Set-up the loading bar */
        var loadingBar = this.add.sprite(400, 300, "loading");
        loadingBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(loadingBar);

        /* Load tile map */

        /* Load images */
        this.game.load.image("burn", "assets/burn.png");
        this.game.load.image("control-bar", "assets/control-bar.png");
        this.game.load.image("earth-ground", "assets/earth_ground.png");
        this.game.load.image("earth-sky", "assets/earth_sky.png");
        this.game.load.image("mars-ground", "assets/mars_ground.png");
        this.game.load.image("mars-sky", "assets/mars_sky.png");
        this.game.load.image("moon-ground", "assets/moon_ground.png");
        this.game.load.image("moon-sky", "assets/moon_sky.png");
        this.game.load.image("neptune-ground", "assets/neptune_ground.png");
        this.game.load.image("neptune-sky", "assets/neptune_sky.png");
        this.game.load.image("ship", "assets/rocket.png");
        this.game.load.image("SolarMapBurn", "assets/SolarMapBurn.png");
        this.game.load.image("SolarMapShip", "assets/SolarMapShip.png");
        this.game.load.image("stars", "assets/stars.png");
        this.game.load.image("satellite", "assets/satellite.png");
        this.game.load.image("asteroid belt", "assets/asteroidBelt.png");

        /* Load sprites */
        this.game.load.spritesheet("celestial bodies",
            "assets/celestial-bodies.png", 80, 80);
        this.game.load.spritesheet("exhaust", "assets/exhaust.png", 10, 10);
        this.game.load.spritesheet("explosion", "assets/explosion.png", 64, 64);
        this.game.load.spritesheet("launch-pad", "assets/launchpad.png", 80,
            80);
        this.game.load.spritesheet("buttons", "assets/button_sheet.png", 120,
            80);
        this.game.load.spritesheet("playB", "assets/playB.png", 120, 80);
        this.game.load.spritesheet("asteroid", "assets/asteroid.png", 40, 40);

        /* Load Sounds */
        this.game.load.audio("thrusters", "assets/shuttle_launch.ogg");
        this.game.load.audio("spaceMusic", "assets/music.ogg");
    },

    /* Play the intro state */
    create: function() {
        console.log("Preload");

        /* Play the background music */

        this.game.state.start("intro");
    }
};