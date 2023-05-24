let boardSize = 10;
let numberOfMines = 10;
let timerInterval;
const statuses = {
  hidden: 'hidden',
  mine: 'mine',
  number: 'number',
  marked: 'marked'
};
const colorScheme = {
  1: 'rgb(164, 68, 253)',
  2: 'rgb(0, 128, 255)',
  3: 'lightblue',
  4: 'green',
  5: 'yellow',
  6: 'orange',
  7: 'red',
  8: 'black'
}
const levels = [
  {
    level: 'easy',
    boardSize: 10,
    numberOfMines: 10
  },
  {
    level: 'medium',
    boardSize: 15,
    numberOfMines: 40
  },
  {
    level: 'hard',
    boardSize: 25,
    numberOfMines: 99
  },
];

const audioElements = [];

const clickSound = new Audio('./assets/click.mp3');
const mineSound = new Audio('./assets/explosion.mp3');
const loseSound = new Audio('./assets/lose.mp3');
const winSound = new Audio('./assets/win.mp3');

audioElements.push(clickSound);
audioElements.push(mineSound);
audioElements.push(loseSound);
audioElements.push(winSound);

let currentLevelObj = levels.find((object) => {
  object.level === 'easy';
});
let boardArray = [];
let gameResults = [];
let stepsCount = 0;
let gameRun = false;
let gameOver = false;
let timer = 0;
let currTheme = document.getElementById('theme-link').getAttribute('href');
let soundOff = false;

window.addEventListener('beforeunload', () => {
  const params = {
    currentLevelObj,
    boardArray,
    gameResults,
    stepsCount,
    gameRun,
    gameOver,
    timer,
    currTheme,
    numberOfMines,
    soundOff
  }

  localStorage.setItem('params', JSON.stringify(params));
});

window.addEventListener('load', () => {
  const params = JSON.parse(localStorage.getItem('params'));

  if (!params) {
    createBoardLayout();
    return;
  }

  stepsCount = params.stepsCount;
  gameResults = params.gameResults;
  gameRun = params.gameRun;
  gameOver = params.gameOver;
  timer = params.timer;
  numberOfMines = params.numberOfMines;
  soundOff = params.soundOff;

  changeTheme(params.currTheme);
  createBoardLayout();
  changeLevel(params.currentLevelObj, numberOfMines);
  switchSound();

  params.boardArray.forEach((row, y) => {
    row.forEach((tile, x) => {
      const currentTile = boardArray[y][x];
      currentTile.status = tile.status;
      currentTile.mine = tile.mine;
      currentTile.minesAround = tile.minesAround;
      currentTile.tileNumber = tile.tileNumber;
    });
  });

  if (gameOver) {
    document.querySelector('.board').style.pointerEvents = 'none';
  } else {
    if (gameRun) {
      setTimer();
    }
  }
});


function createBoardLayout() {
  const main = document.createElement('main');
  main.classList.add('container');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const gameOverMsg = document.createElement('div');
  gameOverMsg.classList.add('game-over-msg');
  gameOverMsg.classList.add('pop-up');

  const checkHistMsg = document.createElement('div');
  checkHistMsg.classList.add('check-hist-msg');
  checkHistMsg.classList.add('pop-up');

  const resultsList = document.createElement('ol');
  resultsList.classList.add('results-list');

  const closeMsg = document.createElement('div');
  closeMsg.classList.add('close-msg');
  closeMsg.innerText = '✖';
  closeMsg.addEventListener('click', () => {
    overlay.classList.remove('show');
    gameOverMsg.classList.remove('show');
  })

  const closeHist = closeMsg.cloneNode(true);
  closeHist.addEventListener('click', () => {
    overlay.classList.remove('show');
    checkHistMsg.classList.remove('show');
  })

  const textMsg = document.createElement('p');
  textMsg.classList.add('text-msg');

  const title = document.createElement('h1');
  title.classList.add('title');
  title.innerText = 'Minesweeper game';

  const gameInfo = document.createElement('div');
  gameInfo.classList.add('game-info');

  const steps = document.createElement('div');
  steps.classList.add('steps')
  steps.innerText = `Steps: ${stepsCount}`;

  const time = document.createElement('div');
  time.classList.add('time')
  time.innerText = `Time spent: ${timer} sec`;

  const gameField = document.createElement('div');
  gameField.classList.add('game-field');

  const board = document.createElement('div');
  board.classList.add('board');
  board.style.setProperty('--size', boardSize);

  for (let y = 0; y < boardSize; y++) {
    let boardArrayRow = [];

    for (let x = 0; x < boardSize; x++) {
      const tileElem = document.createElement('div');
      tileElem.dataset.status = statuses.hidden;
      tileElem.classList.add('tile');

      const tile = {
        x: x,
        y: y,
        get status() {
          return tileElem.dataset.status;
        },
        set status(value) {
          tileElem.dataset.status = value;
        },
        mine: false,
        minesAround: undefined,
        get tileNumber() {
          return tileElem.innerText;
        },
        set tileNumber(value) {
          tileElem.innerText = value;
          tileElem.style.color = colorScheme[value];
        }
      };

      tileElem.addEventListener('click', () => {
        onTilePress(tile);
      })
      tileElem.addEventListener('contextmenu', (event) => {
        checkAndStartGame(tile);

        event.preventDefault();
        markTile(tile);
        checkGameEnd(tile);
      })
      board.appendChild(tileElem);

      boardArrayRow.push(tile);
    }

    boardArray.push(boardArrayRow);

  }

  const settings = document.createElement('div');
  settings.classList.add('settings');

  const switches = document.createElement('div');
  switches.classList.add('switches');

  const themeSwitch = document.createElement('button');
  themeSwitch.classList.add('theme-switch');

  const lightTheme = document.createElement('div');
  lightTheme.classList.add('light-theme');
  lightTheme.innerText = '☀';

  const darkTheme = document.createElement('div');
  darkTheme.classList.add('dark-theme');
  darkTheme.innerText = '☽';

  const soundSwitch = document.createElement('button');
  const soundOffImg = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor"><path d="M15 23l-9.309-6h-5.691v-10h5.691l9.309-6v22zm-9-15.009v8.018l8 5.157v-18.332l-8 5.157zm14.228-4.219c2.327 1.989 3.772 4.942 3.772 8.229 0 3.288-1.445 6.241-3.77 8.229l-.708-.708c2.136-1.791 3.478-4.501 3.478-7.522s-1.342-5.731-3.478-7.522l.706-.706zm-2.929 2.929c1.521 1.257 2.476 3.167 2.476 5.299 0 2.132-.955 4.042-2.476 5.299l-.706-.706c1.331-1.063 2.182-2.729 2.182-4.591 0-1.863-.851-3.529-2.184-4.593l.708-.708zm-12.299 1.299h-4v8h4v-8z"/></svg>';
  const soundOnImg =  '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor"><path d="M18 23l-9.305-5.998.835-.651 7.47 4.815v-10.65l1-.781v13.265zm0-15.794l5.384-4.206.616.788-23.384 18.264-.616-.788 5.46-4.264h-2.46v-10h5.691l9.309-6v6.206zm-11.26 8.794l1.26-.984v-7.016h-4v8h2.74zm10.26-8.013v-5.153l-8 5.157v6.244l8-6.248z"/></svg>'
  soundSwitch.innerHTML = soundOff ? soundOffImg : soundOnImg;
  soundSwitch.classList.add('sound-switch');
  soundSwitch.addEventListener('click', () => {
    if (soundOff) {
      soundOff = false;
      soundSwitch.innerHTML = soundOnImg;
    } else {
      soundOff = true;
      soundSwitch.innerHTML = soundOffImg;
    }
    switchSound();
  })

  themeSwitch.addEventListener('click', () => {
    changeTheme();
  })

  const newGameBtn = document.createElement('button');
  newGameBtn.classList.add('new-game-btn');
  newGameBtn.innerText = 'Start new game'
  newGameBtn.addEventListener('click', () => {
    startNewGame();
  })

  const checkHistBtn = document.createElement('button');
  checkHistBtn.classList.add('check-hist-btn');
  checkHistBtn.innerText = 'Check history'
  checkHistBtn.addEventListener('click', () => {
    checkHist();
  })

  const levelsList = document.createElement('select');
  levelsList.setAttribute('id', 'levels-list');
  const levelsLabel = document.createElement('label');
  levelsLabel.setAttribute('for', 'levels-list');
  levelsLabel.innerText = 'Choose your level:';
  for (let i = 0; i < levels.length; i++) {
    let levelOption = document.createElement('option');
    levelOption.value = levels[i].level;
    levelOption.innerText = levels[i].level;
    levelsList.appendChild(levelOption);
  }
  levelsList.addEventListener('change', () => {
    resetGameProgress();
    changeLevel();
  })

  const numOfMinesInput = document.createElement('input');
  numOfMinesInput.setAttribute('id', 'num-of-mines-input');
  numOfMinesInput.setAttribute('type', 'number');
  numOfMinesInput.setAttribute('min', '10');
  numOfMinesInput.setAttribute('max', '99');
  numOfMinesInput.setAttribute('step', '1');
  numOfMinesInput.required = true;
  numOfMinesInput.setAttribute('value', numberOfMines);
  numOfMinesInput.setAttribute('title', 'A number from 10 to 99');
  const numOfMinesLabel = document.createElement('label');
  numOfMinesLabel.setAttribute('for', 'num-of-mines-input');
  numOfMinesLabel.innerText = 'Enter number of mines:';
  numOfMinesInput.addEventListener('change', () => {
    if (numOfMinesInput.value < 10 || numOfMinesInput.value > 99) {
      numOfMinesInput.value = currentLevelObj.numberOfMines;
    } else {
      resetGameProgress();
      changeLevel(undefined, +numOfMinesInput.value);
    }
  })

  gameOverMsg.appendChild(closeMsg);
  gameOverMsg.appendChild(textMsg);
  checkHistMsg.appendChild(closeHist);
  checkHistMsg.appendChild(resultsList);
  gameInfo.appendChild(steps);
  gameInfo.appendChild(time);
  themeSwitch.appendChild(darkTheme);
  themeSwitch.appendChild(lightTheme);
  switches.appendChild(themeSwitch);
  switches.appendChild(soundSwitch);
  settings.appendChild(numOfMinesLabel);
  settings.appendChild(numOfMinesInput);
  settings.appendChild(levelsLabel);
  settings.appendChild(levelsList);
  settings.appendChild(switches);
  settings.appendChild(newGameBtn);
  settings.appendChild(checkHistBtn);
  gameField.appendChild(board);
  gameField.appendChild(settings);
  main.appendChild(title);
  main.appendChild(gameInfo);
  main.appendChild(gameField);
  main.appendChild(overlay);
  main.appendChild(gameOverMsg);
  main.appendChild(checkHistMsg);
  document.body.appendChild(main);

}

function checkAndStartGame(tile) {
  if (!gameRun) {
    setTimer();
    getMinePositions(tile);
    checkNeighbours();
    gameRun = true;
  }
}

function getMinePositions(tile) {
  const positions = [];
  while (positions.length < numberOfMines) {
    const position = {
      x: getRandomNumber(boardSize),
      y: getRandomNumber(boardSize)
    }

    if (!positions.some(matchPosition.bind(null, position)) && !matchPosition(position, tile)) {
      positions.push(position);
      boardArray[position.y][position.x].mine = true;
    }
  }
  return positions;
}

function getRandomNumber(boardSize) {
  return Math.floor(Math.random() * boardSize);
}

function matchPosition(baseValue, compareValue) {
  return baseValue.x === compareValue.x && baseValue.y === compareValue.y;
}

function markTile(tile) {
  if (tile.status !== statuses.hidden && tile.status !== statuses.marked)
    return
  if (tile.status === statuses.marked)
    tile.status = statuses.hidden;
  else {
    clickSound.play();
    tile.status = statuses.marked;
  }
}

function onTilePress(tile) {
  if ((!tile.mine) && (tile.status === statuses.hidden)) {
    clickSound.play();
  }
  countSteps(tile);
  document.querySelector('.board').style.pointerEvents = 'none';
  document.querySelector('.new-game-btn').style.pointerEvents = 'none';
  revealTile(tile).then(() => {
    document.querySelector('.board').style.pointerEvents = 'auto';
    document.querySelector('.new-game-btn').style.pointerEvents = 'auto';
    checkGameEnd(tile);
  });
}

function revealTile(tile, auto) {
  if (!(tile.status === statuses.hidden || (tile.status === statuses.marked && auto)))
    return Promise.resolve();

  if (tile.mine) {
    tile.status = statuses.mine;
    mineSound.play();
    return Promise.resolve();
  } else {
    tile.status = statuses.number;
    if (tile.minesAround) {
      tile.tileNumber = tile.minesAround;
    }

    return revealNeihbourTiles(tile);
  }
}

function revealNeihbourTiles(tile) {
  if (tile.minesAround !== 0) {
    return Promise.resolve();
  }

  let promises = [];
  for (let yOffset = -1; yOffset <= 1; yOffset++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      const neihbourTile = boardArray[tile.y + yOffset]?.[tile.x + xOffset];
      if (neihbourTile) {
        promises.push(new Promise(resolve => {
          setTimeout(() => {
            revealTile(neihbourTile, true).then(() => resolve());
          }, 100);
        }));
      }
    }
  }
  return Promise.all(promises);
}

function countSteps(tile) {
  checkAndStartGame(tile);

  if (tile.status === statuses.hidden) {
    stepsCount = stepsCount + 1;
    document.querySelector('.steps').innerText = `Steps: ${stepsCount}`;
  }
}

function checkNeighbours() {
  boardArray.forEach((row) => {
    row.forEach((tile) => {
      let countNeighbourMines = 0;

      if (!tile.mine) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          for (let xOffset = -1; xOffset <= 1; xOffset++) {
            if (boardArray[tile.y + yOffset]?.[tile.x + xOffset]?.mine) {
              countNeighbourMines += 1;
            }
          }
        }
        tile.minesAround = countNeighbourMines;
        countNeighbourMines = 0;
      }
    })
  })
}

function checkGameEnd(tile) {
  let msg = '';
  if (tile.status === statuses.mine) {
    saveGameRes(false);
    setTimeout(() => {
      loseSound.play();
    }, 1000);
    msg = 'Game over. Try again';
  } else if (
    !boardArray.flat(2).some((element) =>
      element.status === statuses.hidden && !element.mine) ||
    !boardArray.flat(2).some((element) =>
      element.mine && element.status !== statuses.marked)
  ) {
    boardArray.flat(2).forEach((element) => {
      if (element.mine) {
        element.status = statuses.marked;
      }
    })
    saveGameRes(true);
    winSound.play();
    msg = `Hooray! You found all mines in ${timer} seconds and ${stepsCount} move(s)!`
  }

  if (msg) {
    gameOver = true;
    stopTimer();
    document.querySelector('.text-msg').innerText = msg;
    document.querySelector('.overlay').classList.add('show');
    document.querySelector('.game-over-msg').classList.add('show');
    document.querySelector('.board').style.pointerEvents = 'none';
  }
}

function runTimer() {
  timer += 1;
  document.querySelector('.time').innerText = `Time spent: ${timer} sec`;
}

function setTimer() {
  timerInterval = setInterval(runTimer, 1000);
}

function stopTimer() {
  gameRun = false;
  clearInterval(timerInterval);
}

function resetGameProgress() {
  gameOver = false;
  timer = 0;
  stopTimer();
  stepsCount = 0;
  timer = 0;
  document.querySelector('.steps').innerText = `Steps: ${stepsCount}`;
  document.querySelector('.time').innerText = `Time spent: ${timer} sec`;
  document.querySelector('.board').style.pointerEvents = 'auto';
}

function startNewGame() {
  resetGameProgress();

  for (let y = 0; y < boardSize; y++) {
    let boardArrayRow = [];

    for (let x = 0; x < boardSize; x++) {
      let tile = boardArray[y][x];
      tile.status = statuses.hidden;
      tile.mine = false;
      tile.minesAround = undefined;
      tile.tileNumber = '';
    }
  }

}

function saveGameRes(winFlag) {
  const currentResult = {
    win: winFlag,
    steps: stepsCount,
    time: timer
  }

  gameResults.unshift(currentResult);
  if (gameResults.length > 10)
    gameResults.pop();
}

function checkHist() {
  const resultsList = document.querySelector('.results-list');
  resultsList.innerHTML = '';

  if (!gameResults.length) {
    let noResults = document.createElement('p');
    noResults.innerText = "You haven't played yet";
    resultsList.appendChild(noResults);
  } else {
    for (let i = 0; i < gameResults.length; i++) {
      let gameResult = document.createElement('li');
      gameResult.innerText = `You ${gameResults[i].win ? 'won' : 'lost'} in ${gameResults[i].time} seconds and ${gameResults[i].steps} move(s)`;
      resultsList.appendChild(gameResult);
    }
  }

  document.querySelector('.overlay').classList.add('show');
  document.querySelector('.check-hist-msg').classList.add('show');
}

function changeLevel(levelObj, newNumOfMines) {
  const board = document.querySelector('.board');

  const levelList = document.querySelector('#levels-list');
  if (!levelObj) {
    const levelName = levelList.value;
    levelObj = levels.find((levelObj) => levelObj.level === levelName);
  } else {
    levelList.value = levelObj.level;
  }

  currentLevelObj = levelObj;
  boardSize = levelObj.boardSize;

  if (newNumOfMines) {
    numberOfMines = newNumOfMines;
  } else {
    numberOfMines = levelObj.numberOfMines;
    document.querySelector('#num-of-mines-input').value = numberOfMines;
  }

  boardArray = [];
  board.innerHTML = '';
  board.style.setProperty('--size', boardSize);

  for (let y = 0; y < boardSize; y++) {
    let boardArrayRow = [];

    for (let x = 0; x < boardSize; x++) {
      const tileElem = document.createElement('div');
      tileElem.dataset.status = statuses.hidden;
      tileElem.classList.add('tile');

      const tile = {
        x: x,
        y: y,
        get status() {
          return tileElem.dataset.status;
        },
        set status(value) {
          tileElem.dataset.status = value;
        },
        mine: false,
        minesAround: undefined,
        get tileNumber() {
          return tileElem.innerText;
        },
        set tileNumber(value) {
          tileElem.innerText = value;
          tileElem.style.color = colorScheme[value];
        }
      };

      tileElem.addEventListener('click', () => {
        onTilePress(tile);
      })
      tileElem.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        checkAndStartGame(tile);
        markTile(tile);
        checkGameEnd(tile);
      })
      board.appendChild(tileElem);

      boardArrayRow.push(tile);
    }

    boardArray.push(boardArrayRow);

  }
}

function changeTheme(theme) {

  const lightTheme = 'styles/light.css';
  const darkTheme = 'styles/dark.css';

  if (theme) {
    currTheme = theme;
  } else {
    if (currTheme == lightTheme) {
      currTheme = darkTheme;
    }
    else {
      currTheme = lightTheme;
    }
  }

  document.getElementById('theme-link').setAttribute('href', currTheme);
}

function switchSound() {
  audioElements.forEach((audio) => {
      soundOff ? audio.muted = true : audio.muted = false;
  })
}