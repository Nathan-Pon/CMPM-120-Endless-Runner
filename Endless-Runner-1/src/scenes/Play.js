/* 
** Name: Zhendong Jiang
** Porject: Endless Runner
** Date: April 22, 2021
*/

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init() {
        this.gameOver = false;
    }

    create() {
        this.seawave = this.add.tileSprite(0, 0, 640, 480, 'sea').setOrigin(0, 0);

        this.sharkSpeed = -450;
        this.sharkMaxSpeed = -1000;
        level = 0;
        this.extremeMode = false;
        this.shadowLock = false;

        // add bgm
        this.bgm = this.sound.add('bgm', {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        p1Swimmer = this.physics.add.sprite(64, game.config.height/2, 'player').setOrigin(0.5, 0.5);
        p1Swimmer.setSize(105, 105);
        p1Swimmer.setOffset(0, 0);
        p1Swimmer.setImmovable();
        p1Swimmer.setMaxVelocity(0, 300);
        p1Swimmer.setDragY(200);
        p1Swimmer.setDepth(1);
        p1Swimmer.destroyed = false;
        p1Swimmer.anims.play('player', true);

        this.sharkGroup = this.add.group({
            runChildUpdate: true
        });

        this.time.delayedCall(2500, () => {
            this.addSharks();
        });

        // display time
        // this.gameTimer = this.time.addEvent({
        //     delay: 1000,
        //     callback: this,
        //     callbackScope: this,
        //     loop: true
        // });
        // let timeConfig = {
        //     fontFamily: 'Courier',
        //     fontSize: '28px',
        //     color: '#FFFFFF',
        //     align: 'right',
        //     padding: {
        //         top: 5,
        //         bottom: 5,
        //     },
        //     fixedWidth: 100
        // }
        // this.timeDisplay = this.add.text(game.config.width / 2, 10, 'Time: ' + this.game.time.totalElapsedSeconds(), timeConfig).setOrigin(0.5, 0);
        cursors = this.input.keyboard.createCursorKeys();
    }

    addSharks() {
        let movementSpeed = Phaser.Math.Between(0, 50);
        let sharks = new Sharks(this, this.sharkSpeed - movementSpeed);
        this.sharkGroup.add(sharks);
    }

    update(time, delta) {
        let deltaMultiplier = (delta/16.6666667);
        this.seawave.tilePositionX += (waveSpeed/2) * deltaMultiplier;
        if(!p1Swimmer.destroyed) {
            if(cursors.up.isDown) {
                p1Swimmer.body.velocity.y -= p1SwimmerVelocity;
            } else if(cursors.down.isDown) {
                p1Swimmer.body.velocity.y += p1SwimmerVelocity;
            }
            this.physics.world.collide(p1Swimmer, this.sharkGroup, this.p1SwimmerCollision, null, this);
        }

         /* REFERENCE CODE FOR COLLISION DETECTION
        
            //check overlaps
		    if(!this.key_flag) {
			    this.physics.overlap(this.p1Swimmer, this.sensor, this.keyTrigger, null, this);
	    	} else {
			this.physics.collide(this.p1, this.goldKey, this.useKeyOpenWall, null, this);
		}
         keyTrigger() {
		    // add key to world, set key flag, and untint 🆒 sensor
		    this.goldKey = this.physics.add.sprite(100, 100, 'goldKey');
		    this.goldKey.body.setSize(24, 24);
		    this.goldKey.setAngle(45);
		    this.key_flag = true;
		    this.sensor.setTint();
	    }

	    useKeyOpenWall(player, collided) {
		    if(collided.texture.surboard === 'surfboard') {
			    this.player
		    }
		    collided.destroy();
	} */
        
    }

    p1SwimmerCollision() {
        p1Swimmer.destroyed = true;
        let p1Death = this.add.sprite(p1Swimmer.x, p1Swimmer.y, 'bloodExplode').setOrigin(0, 0);
        p1Death.anims.play('bloods');
        this.sound.play('death', { 
            volume: 0.25 
        });
        p1Death.on('animationcomplete', () => {
            p1Death.destroy();
        });
        this.time.delayedCall(10, () => {
            p1Swimmer.destroy();
        });
        this.time.delayedCall(1000, () => {
            this.scene.start('endScene');
        });
    }
}