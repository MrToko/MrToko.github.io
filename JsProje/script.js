
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const healtyElement = document.querySelector(".healty");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let healtyX = null, healtyY = null; // Sağlık kutusu başlangıçta görünmesin
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let healty = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const changeHealtyPosition = () => {
    healtyX = Math.floor(Math.random() * 30) + 1;
    healtyY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    playBoard.classList.add("game-over-animation");

    setTimeout(() => {
        playBoard.classList.remove("game-over-animation");
        playBoard.classList.add("fade-out");
        setTimeout(() => {
            location.reload();
        }, 1000);
    }, 2000);
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

const initgame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `
        <div class="food" style="grid-area: ${foodY} / ${foodX}"></div>
    `;

    if (healtyX !== null && healtyY !== null) {
        htmlMarkup += `<div class="healty" style="grid-area: ${healtyY} / ${healtyX}"></div>`;
    }

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    if (snakeX === healtyX && snakeY === healtyY) {
        healty++; // Sağlık puanını artır
        healtyElement.innerText = `Healty: ${healty}`;
        healtyX = healtyY = null; // Sağlık kutusunu geçici olarak kaldır
    
        // 1 dakika sonra yeni sağlık kutusu oluştur
        setTimeout(() => {
            changeHealtyPosition();
        }, 20000); // 60 saniye (1 dakika)
    }


    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            if (healty > 0) {
                healty--;
                healtyElement.innerText = `Healty: ${healty}`;
                snakeBody.splice(i); // Yılanın kendini yediği kısmı ve sonrasını kaldır
                break; // Kendini bir kez yiyebilsin
            } else {
                gameOver = true;
            }
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

// 2 dakika sonra sağlık kutusunu aktif et
setTimeout(() => {
    changeHealtyPosition();
    // Sağlık kutusunun pozisyonunu her 2 dakikada bir değiştirmek için ekleyebilirsiniz:
    setInterval(() => {
        changeHealtyPosition();
    }, 120000); // 2 dakika
}, 10000); // İlk sağlık kutusu 2 dakika sonra

changeFoodPosition();
setIntervalId = setInterval(initgame, 125);
document.addEventListener("keydown", changeDirection);
