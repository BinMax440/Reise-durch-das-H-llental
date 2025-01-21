// Simple 2D Adventure Game: Ritter Kuno's Journey

// Basic setup for Phaser.js framework
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Global variables for the game
let player, cursors, greif, obstacles, timerText, timer;
let remainingTime = 120; // 2 minutes to complete the game

function preload() {
    // Load assets
    this.load.image('background', 'assets/background.png'); // Add a simple forest image
    this.load.image('player', 'assets/ritter_kuno.png'); // Sprite for the player
    this.load.image('greif', 'assets/greif.png'); // Sprite for the Greif
    this.load.image('obstacle', 'assets/rock.png'); // Obstacles like rocks
}

function create() {
    // Add background
    this.add.image(400, 300, 'background');

    // Add player sprite
    player = this.physics.add.sprite(100, 300, 'player');
    player.setCollideWorldBounds(true);

    // Add Greif sprite
    greif = this.physics.add.sprite(200, 100, 'greif');

    // Add obstacles
    obstacles = this.physics.add.group({
        key: 'obstacle',
        repeat: 5,
        setXY: { x: 150, y: 150, stepX: 100 }
    });

    // Add timer text
    timerText = this.add.text(16, 16, `Time: ${remainingTime}s`, {
        fontSize: '24px',
        fill: '#ffffff'
    });

    // Enable collision between player and obstacles
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    // Input handling
    cursors = this.input.keyboard.createCursorKeys();

    // Timer countdown
    timer = this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Player movement
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-150);
    } else if (cursors.right.isDown) {
        player.setVelocityX(150);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-150);
    } else if (cursors.down.isDown) {
        player.setVelocityY(150);
    }

    // Check if time runs out
    if (remainingTime <= 0) {
        this.add.text(300, 250, 'Game Over', {
            fontSize: '48px',
            fill: '#ff0000'
        });
        this.physics.pause();
    }
}

function updateTimer() {
    remainingTime--;
    timerText.setText(`Time: ${remainingTime}s`);
}

function hitObstacle(player, obstacle) {
    obstacle.disableBody(true, true);
    remainingTime -= 10; // Penalty for hitting an obstacle
}
