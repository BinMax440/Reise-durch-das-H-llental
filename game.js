// Phaser-Konfiguration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
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

let player, cursors, obstacles, timerText;
let remainingTime = 120; // 2 Minuten

// Eigene Bilder hier einfügen:
const ASSETS = {
    background: 'assets/background.png', // Hintergrundbild
    player: 'assets/ritter_kuno.png',    // Bild für den Spieler
    obstacle: 'assets/rock.png'         // Bild für Hindernisse
};

function preload() {
    // Eigene Bilder laden
    this.load.image('background', ASSETS.background);
    this.load.image('player', ASSETS.player);
    this.load.image('obstacle', ASSETS.obstacle);
}

function create() {
    // Hintergrund hinzufügen
    this.add.image(400, 300, 'background');

    // Spieler hinzufügen
    player = this.physics.add.sprite(100, 300, 'player');
    player.setCollideWorldBounds(true);

    // Hindernisse hinzufügen
    obstacles = this.physics.add.group({
        key: 'obstacle',
        repeat: 5,
        setXY: { x: 200, y: 100, stepX: 120 }
    });

    // Timer-Text hinzufügen
    timerText = this.add.text(16, 16, `Zeit: ${remainingTime}s`, {
        fontSize: '24px',
        fill: '#ffffff'
    });

    // Kollisionen zwischen Spieler und Hindernissen
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    // Eingabesteuerung hinzufügen
    cursors = this.input.keyboard.createCursorKeys();

    // Timer-Countdown
    this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Bewegung des Spielers
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

    // Spielende, wenn die Zeit abläuft
    if (remainingTime <= 0) {
        this.add.text(300, 250, 'Spiel vorbei!', {
            fontSize: '48px',
            fill: '#ff0000'
        });
        this.physics.pause();
    }
}

function updateTimer() {
    remainingTime--;
    timerText.setText(`Zeit: ${remainingTime}s`);
}

function hitObstacle(player, obstacle) {
    obstacle.disableBody(true, true);
    remainingTime -= 10; // 10 Sekunden Strafe
}
