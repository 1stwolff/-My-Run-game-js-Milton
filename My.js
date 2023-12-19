let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// My mouse aka the bird
let birdWidth = 40;
let birdHeight = 30;
let birdX = boardWidth / 8; //x position based off canva or board dimensions
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
}

// cats aka pipes or obstacles 
let pipeArray = [];
let pipeWidth = 85;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -3; //I use this to change the speed of my objects aka the cats
let velocityY = 0;
let gravity = 0.35;

let targetVelocityY = 0;
const accelerationY = 0.2; // Adjust this value to control the acceleration

let gameOver = false;
let score = 0;

// these are variables for my moving background
let backgroundImage;
let backgroundX = 0;
let backgroundSpeed = 1;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    // load images
    birdImg = new Image();
    birdImg.src = "—Pngtree—realistic 3d cute mouse ai_9045659.png"; //pulls in mouse image
    birdImg.onload = function () {

        // I put the music below this
    const backgroundMusic = document.getElementById("backgroundMusic");

    // Start playing the background music
    backgroundMusic.play();
    // Toggle play/pause on button click
toggleMusicButton.addEventListener("click", function() {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  });    //I put music above this

            // draws in the mouse aka bird
        context.drawImage(birdImg, 0, 0, 2072, 1759, bird.x, bird.y, bird.width, bird.height);

        // load background Image
        backgroundImage = new Image();
        backgroundImage.src = "pexels-laura-tancredi-7078716.jpg"; // this is why changing it in my css doesn't do anything
        
        //remember above is w I changed the background image for canva board not body
        // Make the background Image load before the game starts
        backgroundImage.onload = function () {
            requestAnimationFrame(update);
        };
    }

    topPipeImg = new Image();
    topPipeImg.src = "cat-1767554_640.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "cat-1767554_640.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //I use this to adjust the time between when the next object appears
    document.addEventListener("keydown", moveBird); //197 move bird function is further down as well as the keydown assignments
}

// Separate function to draw the background
function drawBackground() {
    // Move the background
    backgroundX -= backgroundSpeed;

    // Draw the background
    context.drawImage(backgroundImage, backgroundX, 0, board.width, board.height);
    context.drawImage(backgroundImage, backgroundX + board.width, 0, board.width, board.height);

    // Reset background position when it goes off the screen
    if (backgroundX <= -board.width) {
        backgroundX = 0;
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Draw the background
    drawBackground();

    // Interpolate velocity
    velocityY += (targetVelocityY - velocityY) * accelerationY;

    // bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillStyle = "red";
        context.fillText("GAME OVER", 70, 375);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    // (0-1) * pipeHeight/2 
    // 0 -> 128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = 3/4pipeHeight
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 3;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        // Jump
        targetVelocityY = -6;

        // Reset target velocity to allow falling after jumping
        setTimeout(() => {
            targetVelocityY = 0;
        }, 100);

        // reset  game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}


function detectCollision(a, b) { 
    const collisionZonePadding = 5; //  I Adjust this value to make the collision zone larger

    return a.x + collisionZonePadding < b.x + b.width &&
        a.x + a.width - collisionZonePadding > b.x &&
        a.y + collisionZonePadding < b.y + b.height &&
        a.y + a.height - collisionZonePadding > b.y;
}
