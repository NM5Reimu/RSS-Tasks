const SIZE_SELECTION = document.getElementById('sizeSelection');
const CONTROL_ELEMENTS = document.getElementById('controlElements');
const FIELD = document.getElementById('field');
const PAUSE = document.getElementById('pause');
const RESULTS = document.getElementById('results');
const INFO_SIZE = document.getElementById('infoSize');
const SCORE_GAME = document.getElementById('scoreGame');
const TIME_GAME = document.getElementById('timeGame');

const arr = 'arr';
const sortArr = 'sortArr';
const matrixSize = 'matrixSize';
const matrixLength = 'matrixLength';
const matrixResolution = 'matrixResolution';
const score = 'score';
const time = 'time';
const result = 'result';
let createArr = [];
let createSortArr = [];
let createMatrixResolution = '';
let createMatrixLength = 0;
let createMatrixSize = 0;
let createScore = 0;
let createTime = 0;
let timeCounter = false;
let gameFinal = false;
let sound = new Audio();

const playSound = () => {
    sound.pause();
    sound.currentTime = 0;
    sound.src = './assets/sound.mp3';
    sound.volume = 0.3;
    sound.play();
}

const clearLocalStorage = () => {
    createArr = [];
    createSortArr = [];
    createMatrixResolution = '';
    createMatrixLength = 0;
    createMatrixSize = 0;
    createScore = 0;
    createTime = 0;
    localStorage.setItem('arr', createArr);
    localStorage.setItem('sortArr', createSortArr);
    localStorage.setItem('matrixSize', createMatrixSize);
    localStorage.setItem('matrixLength', createMatrixLength);
    localStorage.setItem('matrixResolution', createMatrixResolution);
    localStorage.setItem('score', createScore);
    localStorage.setItem('time', createTime);
}

const drawMatrix = () => {
    FIELD.innerHTML = '';
    SCORE_GAME.innerHTML = `Счет: ${createScore}`;
    INFO_SIZE.innerHTML = createMatrixResolution;
    if (timeCounter) {
        PAUSE.innerHTML = 'Пауза';
        for (let i = 0; i < createMatrixLength; i++) {
            let j = createSortArr[i];
            if (j == 0) {
                FIELD.innerHTML += `<div id ="${j}" class="puzzle puzzle0 puzzle${createMatrixResolution}">${j}</div>`;
            } else {
                FIELD.innerHTML += `<div id ="${j}" class="puzzle puzzle${createMatrixResolution}">${j}</div>`;
            }
        }
    } else {
        if (gameFinal) {
            let minutes = Math.floor(createTime / 60);
            let seconds = createTime % 60;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            FIELD.innerHTML = `<div class="puzzle puzzle1x1 fontSize32">Вы решили головоломку за <br> ${minutes}:${seconds} и ${createScore} ходов</div>`;

            localStorage[result] += `-${createMatrixResolution}_${createScore}-`;

            clearLocalStorage();

            gameFinal = false;
        } else {
            PAUSE.innerHTML = 'Продолжить';
            FIELD.innerHTML = '<div class="puzzle puzzle1x1">Пауза</div>';
        }
    }
}

const drawTime = () => {
    if (timeCounter && gameFinal === false) {
        createTime++
        localStorage.setItem('time', createTime);
        let minutes = Math.floor(createTime / 60);
        let seconds = createTime % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        TIME_GAME.innerHTML = `${minutes} : ${seconds}`;
        createTime;
    }

    setTimeout(drawTime, 1000)

}

drawTime()

if (localStorage['arr']) {
    createArr = localStorage[arr].split(',');
    createArr = createArr.map((el) => Number(el));
    createSortArr = localStorage[sortArr].split(',');
    createSortArr = createSortArr.map((el) => Number(el));
    createMatrixResolution = localStorage[matrixResolution];
    createMatrixLength = Number(localStorage[matrixLength]);
    createMatrixSize = Number(localStorage[matrixSize]);
    createScore = Number(localStorage[score]);
    createTime = localStorage[time];
    drawMatrix();
} else {
    if (!localStorage['result']){
        localStorage.setItem('result', '');
    }
} 


let shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


CONTROL_ELEMENTS.addEventListener('click', (event) => {
    let id = '';
    id = event.target.id === '' ? event.target.parentNode.id : event.target.id;
    if (id === 'newGame') {
        SIZE_SELECTION.classList.add('sizeSelectionActive');
        timeCounter = false;
    } else if (id === 'pause') {
        if (timeCounter) {
            timeCounter = false;
        } else if (!timeCounter) {
            timeCounter = true;
        }
    }
    drawMatrix();
});


SIZE_SELECTION.addEventListener('click', (event) => {
    let id = '';
    id = event.target.id === '' ? event.target.parentNode.id : event.target.id;
    if (id === 'closeSizeBlock') {
        SIZE_SELECTION.classList.remove('sizeSelectionActive');
    } else {
        if (event.target.innerText.length === 3) {

            clearLocalStorage();

            SIZE_SELECTION.classList.remove('sizeSelectionActive');
            createMatrixSize = Number(event.target.innerText[0]);
            createMatrixLength = Math.pow(createMatrixSize, 2);
            createMatrixResolution = event.target.innerText;

            for (let i = 0; i < createMatrixLength; i++) {

                if (i === createMatrixLength - 1) {
                    createArr[i] = 0;
                } else {
                    createArr[i] = i + 1;
                }
            }

            createSortArr = shuffle([...createArr]);
            localStorage.setItem('arr', createArr);
            localStorage.setItem('sortArr', createSortArr);
            localStorage.setItem('matrixSize', createMatrixSize);
            localStorage.setItem('matrixLength', createMatrixLength);
            localStorage.setItem('matrixResolution', createMatrixResolution);
            localStorage.setItem('score', createScore);
            localStorage.setItem('time', createTime);
            timeCounter = true;
            gameFinal = false;
            drawMatrix();
        }
    }
});

FIELD.addEventListener('click', (event) => {
    let id = '';
    id = event.target.id === '' ? event.target.parentNode.id : event.target.id;

    if (id > 0) {
        playSound();
        let index0 = createSortArr.indexOf(0);
        let indexClick = createSortArr.indexOf(Number(id));
        if (createSortArr.indexOf(Number(id)) + 1 === createSortArr.indexOf(0) && (createSortArr.indexOf(Number(id)) + 1) % createMatrixSize != 0) {
            createSortArr[index0] = Number(id);
            createSortArr[indexClick] = 0;
            createScore++;
        } else if (createSortArr.indexOf(Number(id)) - 1 === createSortArr.indexOf(0) && (createSortArr.indexOf(Number(id)) + 1) % createMatrixSize != 1) {
            createSortArr[index0] = Number(id);
            createSortArr[indexClick] = 0;
            createScore++;
        } else if (createSortArr.indexOf(Number(id)) + createMatrixSize === createSortArr.indexOf(0)) {
            createSortArr[index0] = Number(id);
            createSortArr[indexClick] = 0;
            createScore++;
        } else if (createSortArr.indexOf(Number(id)) - createMatrixSize === createSortArr.indexOf(0)) {
            createSortArr[index0] = Number(id);
            createSortArr[indexClick] = 0;
            createScore++;
        }

        if (createSortArr.toString() == createArr.toString()) {
            timeCounter = false;
            gameFinal = true;
        }

        localStorage.setItem('arr', createArr);
        localStorage.setItem('sortArr', createSortArr);
        localStorage.setItem('matrixSize', createMatrixSize);
        localStorage.setItem('matrixLength', createMatrixLength);
        localStorage.setItem('matrixResolution', createMatrixResolution);
        localStorage.setItem('score', createScore);
        drawMatrix();
    }

});