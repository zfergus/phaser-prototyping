/*
 * Digital N: BootState.js
 * Created by Zachary Ferguson
 * Game State Class for booting the main game
 */

"use strict";

var BootState = function() {};

BootState.prototype = {
    /* Load the loading sprite */
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

    /* Move on to the preload state */
    create: function() {
        console.log("Boot");
        this.game.state.start("preload");
    }
};