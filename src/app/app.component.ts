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
    floor: Phaser.TilemapLayer;
    blocked: Phaser.TilemapLayer;
    doorActivators: Phaser.TilemapLayer;
    doors: Phaser.TilemapLayer;
    objects: Phaser.TilemapLayer;
    use: Phaser.TilemapLayer;
    walls: Phaser.TilemapLayer;
    speed: number;
    up = false;
    down = false;
    right = false;
    left = false;


    constructor() {
        this.game = new Phaser.Game(1536, 1536, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }
    preload() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        this.game.load.tilemap('spaceship', 'assets/Spaceship/Spaceship.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/Spaceship/Spaceship.png');
        this.game.load.spritesheet('perso', 'assets/image/RPGSoldier32x32.png', 32, 35, 45);

        this.speed = 300;
    }
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#787878';
        const map = this.game.add.tilemap('spaceship');
        map.addTilesetImage('Spaceship 3', 'tiles');
        map.setCollisionBetween(152);

        this.floor = map.createLayer('Floor', 1536, 1536);
        this.game.add.existing(this.floor);
        this.floor.resizeWorld();
        this.blocked = map.createLayer('Blocked', 1536, 1536);
        this.game.add.existing(this.blocked);
        this.blocked.resizeWorld();
        this.doorActivators = map.createLayer('Door_Activators', 1536, 1536);
        this.game.add.existing(this.doorActivators);
        this.doorActivators.resizeWorld();
        this.doors = map.createLayer('Doors', 1536, 1536);
        this.game.add.existing(this.doors);
        this.doors.resizeWorld();
        this.objects = map.createLayer('Objects', 1536, 1536);
        this.game.add.existing(this.objects);
        this.objects.resizeWorld();
        this.use = map.createLayer('Use_Markers', 1536, 1536);
        this.game.add.existing(this.use);
        this.use.resizeWorld();
        this.walls = map.createLayer('Walls', 1536, 1536);
        this.game.add.existing(this.walls);
        this.walls.resizeWorld();
        this.game.scale.refresh();

        // map.setCollisionBetween();

        this.perso = this.game.add.sprite(6 * 64, 8 * 64, 'perso');
        this.game.physics.enable(this.perso);
        this.perso.body.bounce.y = 0.2;
        this.perso.body.gravity.y = 0;
        this.perso.body.collideWorldBounds = true;
        this.perso.anchor.x = 0.5;
        this.perso.anchor.y = 0.5;
        this.perso.scale.setTo(1.9, 1.9);
        this.perso.animations.add('walk_horizontally', [9, 10, 11, 12], 10, true, true);
        this.perso.animations.add('walk_up', [18, 19, 20, 21], 10, true, true);
        this.perso.animations.add('walk_down', [0, 1, 2, 3], 10, true, true);
        this.perso.animations.add('walk_down_horizontally', [27, 28, 29, 30], 10, true, true);
        this.perso.animations.add('walk_up_horizontally', [36, 37, 38, 39], 10, true, true);
        this.perso.frame = 0;
    }
    update() {
        this.game.physics.arcade.collide(this.perso, this.walls);
        this.game.physics.arcade.collide(this.perso, this.blocked, this.collidecb);

        const cursor = this.game.input.keyboard.createCursorKeys();

        if (cursor.left.isDown) {
            this.left = true;
            this.right = false;
        } else if (cursor.right.isDown) {
            this.left = false;
            this.right = true;
        } else {
            this.left = false;
            this.right = false;
        }

        if (cursor.up.isDown) {
            this.up = true;
            this.down = false;
        } else if (cursor.down.isDown) {
            this.up = false;
            this.down = true;
        } else {
            this.up = false;
            this.down = false;
        }

        this.perso.body.velocity.x = 0;
        this.perso.body.velocity.y = 0;

        if (this.left) {
            this.perso.body.velocity.x = this.speed * (-1);
            if (this.up) {
                this.perso.body.velocity.y = this.speed * (-1);
                if (this.perso.animations.name !== 'walk_up_horizontally' || this.perso.animations.paused) {
                    this.perso.animations.play('walk_up_horizontally', 10, true);
                    this.perso.animations.paused = false;
                }
                if (this.perso.scale.x > 0) {
                    this.perso.scale.x *= -1;
                }
            } else if (this.down) {
                this.perso.body.velocity.y = this.speed;
                if (this.perso.animations.name !== 'walk_down_horizontally' || this.perso.animations.paused) {
                    this.perso.animations.play('walk_down_horizontally', 10, true);
                    this.perso.animations.paused = false;
                }
                if (this.perso.scale.x < 0) {
                    this.perso.scale.x *= -1;
                }
            } else {
                if (this.perso.animations.name !== 'walk_horizontally' || this.perso.animations.paused) {
                    this.perso.animations.play('walk_horizontally', 10, true);
                    this.perso.animations.paused = false;
                }
                if (this.perso.scale.x > 0) {
                    this.perso.scale.x *= -1;
                }
            }
        } else if (this.right) {
            this.perso.body.velocity.x = this.speed;
            if (this.up) {
                this.perso.body.velocity.y = this.speed * (-1);
                if (this.perso.animations.name !== 'walk_up_horizontally' || this.perso.animations.paused) {
                    this.perso.animations.play('walk_up_horizontally', 10, true);
                    this.perso.animations.paused = false;
                }
                if (this.perso.scale.x < 0) {
                    this.perso.scale.x *= -1;
                }
            } else if (this.down) {
                this.perso.body.velocity.y = this.speed;
                if (this.perso.animations.name !== 'walk_down_horizontally' || this.perso.animations.paused) {
                    this.perso.animations.play('walk_down_horizontally', 10, true);
                    this.perso.animations.paused = false;
                }
                if (this.perso.scale.x > 0) {
                    this.perso.scale.x *= -1;
                }
            } else {
                if (this.perso.animations.name !== 'walk_horizontally' || this.perso.animations.paused) {
                    this.perso.animations.play('walk_horizontally', 10, true);
                    this.perso.animations.paused = false;
                }
                if (this.perso.scale.x < 0) {
                    this.perso.scale.x *= -1;
                }
            }
        } else if (this.up) {
            this.perso.body.velocity.y = this.speed * (-1);
            if (this.perso.animations.name !== 'walk_up' || this.perso.animations.paused) {
                this.perso.animations.play('walk_up', 10, true);
                this.perso.animations.paused = false;
            }
            if (this.perso.scale.x < 0) {
                this.perso.scale.x *= -1;
            }
        } else if (this.down) {
            this.perso.body.velocity.y = this.speed;
            if (this.perso.animations.name !== 'walk_down' || this.perso.animations.paused) {
                this.perso.animations.play('walk_down', 10, true);
                this.perso.animations.paused = false;
            }
            if (this.perso.scale.x < 0) {
                this.perso.scale.x *= -1;
            }
        } else {
            this.perso.animations.paused = true;
            this.perso.frame = 0;
        }
    }

    collidecb() {
        console.log('collide');
    }
}
