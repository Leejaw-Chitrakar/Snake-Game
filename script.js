const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const gameOverMessageElement = document.querySelector(".gameovermsg");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
const gridSize = 30; // Consistent with CSS grid

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Function to update the position of the food
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * gridSize) + 1;
    foodY = Math.floor(Math.random() * gridSize) + 1;
}

// Function to handle game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    document.getElementById('gameovermsg').innerHTML = 'Game Over Press R or Space bar to restart';
    gameOverMessageElement.classList.add('show'); // Add the 'show' class to make it visible
    document.addEventListener('keydown', function(event) {
        if (event.key === 'R' || event.key === 'r' || event.key === ' ' || event.key === 'Space') {
            location.reload();
        }
    });
}

// Function to handle the change in direction based on key press
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Event listeners for arrow key clicks
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

// Function to initialize the game
const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}; background-color: #FFFF00; width: 13px; height: 13px; border-radius: 50%;"></div>`;
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    if(snakeX <= 0 || snakeX > gridSize || snakeY <= 0 || snakeY > gridSize) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        if (i === 0) {
            // If it's the head, set a different style (e.g., different background color)
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background-color: #FF0000;"></div>`;
        } else {
            // If it's part of the body, set a different style (e.g., different background color)
            html += `<div class="body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background-color: #00FF00;"></div>`;
        }

        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

// Initial setup
updateFoodPosition();
setIntervalId = setInterval(initGame, 75); //decrease the number to increase the speed of the snake
document.addEventListener("keyup", changeDirection);

//resets the highscore and current score
const resetscr = () => {
    highScore = 0;
    score = 0;
    localStorage.setItem("high-score", highScore);
    highScoreElement.innerText = `High Score: ${highScore}`;
    scoreElement.innerText = `Score: ${score}`;
    gameOverMessageElement.classList.remove('show'); // Hide game over message on reset
    gameOver = false; // Reset game over state
    updateFoodPosition(); // Place the first food
    snakeX = 5; snakeY = 5; // Reset snake position
    snakeBody = []; // Clear snake body
    velocityX = 0; velocityY = 0; // Reset direction
    clearInterval(setIntervalId); // Clear any existing interval
    setIntervalId = setInterval(initGame, 75); // Restart the game loop
}