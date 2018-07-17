/*
 * SpaceSim: ExploreState.js
 * Created by Zachary Ferguson
 * Game State Class for exploring the different celestial bodies.
 */

"use strict";

function MarsExploreState() {};

MarsExploreState.prototype = {
    /* Create the tilemap, player, and groups */
    create: function() {
        console.log("MarsExploreState");

        /* Stretch the world vertically */
        this.game.world.setBounds(0, 0, 800, 7200);
        /* Reposition the camera */
        this.game.camera.y = 0;

        /* Add the background image */
        this.game.add.image(0, 0, "mars-sky");

        /* Create a ground sprite */
        this.ground = this.game.add.sprite(0, this.game.world.height - 40,
            "mars-ground");
        /* Enable physics on the ground */
        this.game.physics.arcade.enable(this.ground);
        this.ground.body.immovable = true;

        var MARS_GRAVITY = 3.77,
            MARS_DRAG = 0.5;

        /* Create the ship on the ground */
        this.ship = this.game.add.existing(new Ship(this.game, this.game.rnd.integerInRange(0, this.game.world.width), 40,
            this.game.remainingFuel, MARS_GRAVITY, MARS_DRAG));
        this.ship.angle = this.game.rnd.integerInRange(-180, 180);
        this.ship.body.velocity.setTo(this.game.rnd.integerInRange(50, 150),
            this.game.rnd.integerInRange(50, 100));
        /* Enable physics on the ship */
        this.game.physics.arcade.enable(this.ship);

        /* Enable the arrow keys for controls */
        this.controls = this.game.input.keyboard.createCursorKeys();

        this.endMessage = "You died of dehydration in a dried riverbed.";

        PlayState.prototype.create_hud.call(this);
        this.thrusterSound = this.game.add.audio("thrusters");
    },

    /* Update game every frame */
    update: function() {
        /* Collide the ground and ship */
        this.game.physics.arcade.collide(this.ground, this.ship,
            function() {
                if (Math.abs(this.ship.body.velocity.y) > 20 ||
                    Math.abs(this.ship.body.velocity.x) > 30) {
                    /* explode */
                    this.thrusterSound.stop();
                    this.game.endMessage = this.endMessage;
                    this.game.state.start("game over");
                } else {
                    this.thrusterSound.stop();
                    /* Successfully landed */
                    this.ship.body.angularVelocity = 0;
                    this.ship.body.velocity.setTo(0, 0);
                    this.ship.angle = 0;
                }
            },
            null, this);

        if (this.ship.y <= 0) {
            this.thrusterSound.stop();
            this.game.remainingFuel = this.ship.fuel;
            this.game.state.start("solar map");
        }

        // Keep the ship on the screen
        if (this.ship.x > this.game.width) {
            this.ship.x = 0;
        }
        if (this.ship.x < 0) {
            this.ship.x = this.game.width;
        }

        PlayState.prototype.controlShip.call(this);

        this.fuelDisplay.text = "Fuel: " + Math.floor((this.ship.fuel));
        this.altDisplay.text = "Altitude: " + Math.floor(this.ground.y -
            this.ship.y);
    }
};