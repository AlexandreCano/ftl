/// <reference path="../../node_modules/phaser-ce/typescript/phaser.comments.d.ts" />

import { Component } from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';
    game: Phaser.Game;
    perso: Phaser.Sprite;
    speed = 4;
    time: Date;

    constructor() {
        this.game = new Phaser.Game(1536, 1536, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }
    preload() {
        this.game.time.advancedTiming = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.load.tilemap('spaceship', 'assets/Spaceship/Spaceship.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/Spaceship/Spaceship.png');
        this.game.load.spritesheet('perso', 'assets/ss.png', 64, 64, 273);
    }
    create() {
        this.game.stage.backgroundColor = '#787878';
        const map = this.game.add.tilemap('spaceship');
        map.addTilesetImage('Spaceship 3', 'tiles');
        const floor = map.createLayer('Floor', 1536, 1536);
        floor.resizeWorld();
        const blocked = map.createLayer('Blocked', 1536, 1536);
        blocked.resizeWorld();
        const doorActivators = map.createLayer('Door_Activators', 1536, 1536);
        doorActivators.resizeWorld();
        const doors = map.createLayer('Doors', 1536, 1536);
        doors.resizeWorld();
        const objects = map.createLayer('Objects', 1536, 1536);
        objects.resizeWorld();
        const use = map.createLayer('Use_Markers', 1536, 1536);
        use.resizeWorld();
        const walls = map.createLayer('Walls', 1536, 1536);
        walls.resizeWorld();
        this.perso = this.game.add.sprite(6 * 64, 8 * 64, 'perso');

        this.perso.animations.add('walk_right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 50, true, true);

        this.perso.animations.play('walk_right', 50, true);
    }
    update() {
        this.time = new Date();
        console.log('time : ' + this.time.getUTCSeconds());
        // if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        //     this.perso.x -= 15;
        //     console.log(this.perso);
        // } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        //     this.perso.x += 15;
        //     console.log(this.perso);
        // }

        // if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        //     this.perso.y -= 15;
        //     console.log(this.perso);
        // } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        //     this.perso.y += 15;
        //     console.log(this.perso);
        // }
    }
}
