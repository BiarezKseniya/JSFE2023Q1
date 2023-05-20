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

let curentLevelObj;
let boardArray = [];
let gameResults = [];
let stepsCount = 0;
let gameRun = false;
let timer = 0;
let currTheme;

window.addEventListener('beforeunload', () => {
  const params = {
    curentLevelObj,
    boardArray,
    gameResults,
    stepsCount,
    gameRun,
    timer,
    currTheme
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
  timer = params.timer;

  changeTheme(params.currTheme);
  createBoardLayout();
  changeLevel(params.curentLevelObj);


  params.boardArray.forEach((row, y) => {
    row.forEach((tile, x) => {
      const currentTile = boardArray[y][x];
      currentTile.status = tile.status;
      currentTile.mine = tile.mine;
      currentTile.minesAround = tile.minesAround;
      currentTile.tileNumber = tile.tileNumber;
    });
  });

  if (gameRun) {
    setTimer();
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

  const themeSwitch = document.createElement('button');
  themeSwitch.classList.add('theme-switch');

  const lightTheme = document.createElement('div');
  lightTheme.classList.add('light-theme');
  lightTheme.innerText = '☀';

  const darkTheme = document.createElement('div');
  darkTheme.classList.add('dark-theme');
  darkTheme.innerText = '☽';

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
  levelsList.classList.add('levels-list');
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

  gameOverMsg.appendChild(closeMsg);
  gameOverMsg.appendChild(textMsg);
  checkHistMsg.appendChild(closeHist);
  checkHistMsg.appendChild(resultsList);
  gameInfo.appendChild(steps);
  gameInfo.appendChild(time);
  themeSwitch.appendChild(darkTheme);
  themeSwitch.appendChild(lightTheme);
  settings.appendChild(themeSwitch);
  settings.appendChild(newGameBtn);
  settings.appendChild(checkHistBtn);
  settings.appendChild(levelsList);
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
  console.log(positions);
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
    const clickSound = new Audio('./assets/click.mp3');
    clickSound.play();
    tile.status = statuses.marked;
  }
}

function onTilePress(tile) {
  if ((!tile.mine) && (tile.status === statuses.hidden)) {
    const clickSound = new Audio('./assets/click.mp3');
    clickSound.play();
  }
  countSteps(tile);
  document.querySelector('.board').style.pointerEvents = "none";
  document.querySelector('.new-game-btn').style.pointerEvents = "none";
  revealTile(tile).then(() => {
    document.querySelector('.board').style.pointerEvents = "auto";
    document.querySelector('.new-game-btn').style.pointerEvents = "auto";
    checkGameEnd(tile);
  });
}

function revealTile(tile) {
  if (tile.status !== statuses.hidden)
    return Promise.resolve();

  if (tile.mine) {
    tile.status = statuses.mine;
    const mineSound = new Audio('./assets/explosion.mp3');
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
            revealTile(neihbourTile).then(() => resolve());
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
      const loseSound = new Audio('./assets/lose.mp3');
      loseSound.play();
    }, 1000);
    msg = 'Game over. Try again';
  } else if (
    !boardArray.flat(2).some((element) =>
      element.status === statuses.hidden && !element.mine) ||
    !boardArray.flat(2).some((element) =>
      element.mine && element.status !== statuses.marked)
  ) {
    saveGameRes(true);
    const winSound = new Audio('./assets/win.mp3');
    winSound.play();
    msg = `Hooray! You found all mines in ${timer} seconds and ${stepsCount} move(s)!`
  }

  if (msg) {
    console.log(gameResults);
    stopTimer();
    document.querySelector('.text-msg').innerText = msg;
    document.querySelector('.overlay').classList.add('show');
    document.querySelector('.game-over-msg').classList.add('show');
    document.querySelector('.board').style.pointerEvents = "none";
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
  timer = 0;
  clearInterval(timerInterval);
}

function resetGameProgress() {
  stopTimer();
  stepsCount = 0;
  timer = 0;
  document.querySelector('.steps').innerText = `Steps: ${stepsCount}`;
  document.querySelector('.time').innerText = `Time spent: ${timer} sec`;
  document.querySelector('.board').style.pointerEvents = "auto";
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

function changeLevel(levelObj) {
  const board = document.querySelector('.board');

  const levelList = document.querySelector('.levels-list');
  if (!levelObj) {
    const levelName = levelList.value;
    levelObj = levels.find((levelObj) => levelObj.level === levelName);
  } else {
    levelList.value = levelObj.level;
  }

  curentLevelObj = levelObj;
  boardSize = levelObj.boardSize;
  numberOfMines = levelObj.numberOfMines;

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

  const link = document.getElementById("theme-link");
  const lightTheme = "styles/light.css";
  const darkTheme = "styles/dark.css";

  if (theme) {
    currTheme = theme;
  } else {
    currTheme = link.getAttribute("href");

    if (currTheme == lightTheme) {
      currTheme = darkTheme;
    }
    else {
      currTheme = lightTheme;
    }
  }

  link.setAttribute('href', currTheme);
}