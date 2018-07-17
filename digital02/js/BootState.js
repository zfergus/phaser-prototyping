/*
 * State Class for booting the game
 * Created by Zachary Ferguson
 */

"use strict";

var BootState = function() {};

BootState.prototype = {
    /* Load the load sprite */
    preload: function() {
        this.game.load.image("loading", "assets/loading.png");
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.maxWidth = 800;
        this.game.scale.maxHeight = 600;
        this.game.scale.windowConstraints = {
            right: "layout",
            bottom: "layout"
        };
    },

    /* Create the load sprite */
    create: function() {
        this.game.state.start("preload");
    }
};