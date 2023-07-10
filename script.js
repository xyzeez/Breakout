const grid = document.querySelector('.grid');
const boardWidth = 560;
const boardHeight = 300;
const blockWidth = 100;
const blockHeight = 20;
let timerId;
const scoreDisplay = document.getElementById('scoreDisplay');
let score = 0;
scoreDisplay.innerHTML = score;

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];

    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
];

function addBlock() {
    for (let i = 0; i < blocks.length ; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.append(block);
    }
}
addBlock();


const userStart = [230, 10];
let userCurrentPosition = userStart;
const user = document.createElement('div');
user.classList.add('user');
positionUser();
grid.append(user);

function positionUser() {
    user.style.left = userCurrentPosition[0] + 'px';
    user.style.bottom = userCurrentPosition[1] + 'px';
}

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (userCurrentPosition[0] > 0) {
                userCurrentPosition[0] -= 10;
                positionUser();
            }
            break;
        case 'ArrowRight':
            if (userCurrentPosition[0] < boardWidth - blockWidth) {
                userCurrentPosition[0] += 10;
                positionUser();
            }
            break;

    }
}
document.addEventListener('keydown', moveUser);


const ballStart = [275, 30];
let ballCurrentPosition = ballStart;
const ball = document.createElement('div');
ball.classList.add('ball');
positionBall();
grid.append(ball);
const ballDiameter = 10;
let xDirection = 1;
let yDirection = 1;

function positionBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    positionBall();
    checkForCollision();
}

timerId = setInterval(moveBall, 10);

function changeDirection() {
    if (xDirection === 1) {
        if (yDirection === 1) {
            xDirection = -1;
            return;
        }
        if (yDirection === -1) {
            yDirection = 1;
            return;
        }
    }
    if (xDirection === -1) {
        if (yDirection === -1) {
            xDirection = 1;
            return;
        }
        if (yDirection === 1) {
            yDirection = -1;
            return;
        }
    }
}

function checkForCollision() {

    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].bottomRight[1])
        ) {
            const allBlocks = document.querySelectorAll('.block');
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;
        }
    }

    if (
        (ballCurrentPosition[0] > userCurrentPosition[0] && ballCurrentPosition[0] < (userCurrentPosition[0] + blockWidth)) &&
        (ballCurrentPosition[1] > userCurrentPosition[1] && ballCurrentPosition[1] < (userCurrentPosition[1] + blockHeight))
    ) {
        changeDirection();
    }


    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter)||
        ballCurrentPosition[0] <= (0) ||
        ballCurrentPosition[1] <= (0)
    ) {
        changeDirection();
    }

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
    }

    if (blocks.length === 0) {
        scoreDisplay.innerHTML = "WIN!";
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
    }
}