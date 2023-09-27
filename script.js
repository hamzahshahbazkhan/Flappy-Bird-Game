let board;
let boardHeight = 640;
let boardWidth = 1080;
let context;



//bird
let birdHeight = 24;
let birdWidth = 34;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let pipeArray = [];
let pipeHeight = 512;
let pipeWidth = 64;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


let velocityX = -2;
let velocityY = 0;
let gravity = 0;

let gameOver = false;
let score = 0;
let hi = 0;
// let interval = 0;



window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');


    // bird

    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);
    birdImg = new Image();
    birdImg.src = "img/flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "img/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "img/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1000);
    document.addEventListener("keydown", moveBird);


}

function update() {

    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    velocityY += gravity; // Apply gravity to the vertical velocity

    bird.y = Math.max(bird.y + velocityY, 0);

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);





    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x = pipe.x + velocityX;
        pipe.y = pipe.y //vel
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)
        detectCollision(bird, pipe);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            pipe.passed = true;
            score += 0.5
            // velocityX += -0.1;
            // interval += -500;

        }


    }
    // while (pipeArray.length > 0 && pipe[0].x + pipe.width < 0) {
    //     pipeArray.shift();   
    // }
    if (bird.y > board.height) {
        gameOver = true;
    }


    context.fillStyle = "white";
    context.font = "45px monospace";
    context.fillText(score, 5, 45);
    hi = Math.max(hi, score);
    context.fillText(hi, 1040, 45);
    context.fillText("HI", 980, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
    if (gameOver) {
        pipeArray = [];
        bird.y = birdY;
        score = 0;
        document.addEventListener('keydown', restart);
        context.fillText("press R to restart", 355, 625)

    }
    pipeArray = pipeArray.filter(pipe => pipe.x + pipeWidth > 0);


}


function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeHeight = pipeY - 192 - (Math.random() * 160)

    let topPipe = {
        img: topPipeImg,
        height: pipeHeight,
        width: pipeWidth,
        x: pipeX,
        y: randomPipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        height: pipeHeight,
        width: pipeWidth,
        x: pipeX,
        y: 160 + randomPipeHeight + topPipe.height,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {


    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        velocityY = -6

        gravity = 0.4;

    }
    // console.log(e);



}

function detectCollision(a, b) {
    if (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) {
        gameOver = true;
    }
}

function restart(e) {
    if (e.code === "KeyR") {
        gameOver = false;
        gravity = 0;
        velocityY = 0;
        velocityX = -2;
        // interval = 0;


    }
}
