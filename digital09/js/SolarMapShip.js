/*
 * SpaceSim: GameOverState.js
 * Created by Zachary Ferguson
 * The SolarMapShip class that inherits from the Phaser.Sprite class.
 */

"use strict";

var SolarMapShip = function(game, x, y, shipCollisionGroup) {
    /* Create the ship sprite. */
    Phaser.Sprite.call(this, game, x, y, "SolarMapShip");
    //this.anchor.setTo(0.5, 1.0);

    /* Set the camera to follow the ship */
    this.game.camera.follow(this);

    /* Create the flame as a child sprite of the ship. */
    this.burn = game.add.sprite(0, 3, "SolarMapBurn");
    this.burn.anchor.setTo(0.5, 0);
    /* Make the burn invisible*/
    this.burn.alpha = 0;
    /* Add the burn as a child so it moves with the ship */
    this.addChild(this.burn);

    /* Enable physics on the ship */
    this.game.physics.p2.enable(this, false, false);

    this.body.collideWorldBounds = true;
    this.collisionGroup = shipCollisionGroup;
    this.body.setCollisionGroup(shipCollisionGroup);

    /* Create base physics values for the ship */
    this.METERSTOPIXELS = 0.1;
    this.mass = 3110; /* Kg */
    this.fuel = 500;
    this.fuelConsumption = 0;
    this.thrust = 100000.0; /* Kg*meters/s/s */
    this.body.damping = 0;
    this.OMEGA = 5;
    //this.body.gravity.y = 9.8 * this.METERSTOPIXELS; /* pixels/s/s */
    //this.body.maxVelocity.setTo(500, 500);
}

/* SolarMapShips are a type of Phaser.Sprite */
SolarMapShip.prototype = Object.create(Ship.prototype);
SolarMapShip.prototype.constructor = SolarMapShip;

/* Engages the engines thrusters. */
SolarMapShip.prototype.engageEngines = function() {
    if (this.fuel > 0) {
        this.fuelConsumption = 0.5;
        this.burn.alpha = 1;

        var xAcceleration = (this.thrust / this.mass) * Math.cos(this.rotation +
            (Math.PI / 2));
        var yAcceleration = (this.thrust / this.mass) * Math.sin(this.rotation +
            (Math.PI / 2));

        this.body.force.x = -xAcceleration * this.METERSTOPIXELS;
        this.body.force.y = -yAcceleration * this.METERSTOPIXELS;
    }
}

/* Disengages the engines thrusters. */
SolarMapShip.prototype.disengageEngines = function() {
    this.fuelConsumption = 0;
    this.burn.alpha = 0;

    this.body.force.x = 0;
    this.body.force.y = 0;
}