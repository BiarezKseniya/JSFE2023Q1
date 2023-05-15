let boardSize = 10;
let numberOfMines = 10;
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
let boardArray = [];
let stepsCount = 0;
let gameRun = false;
let timer = 0;
let timerInterval;

function createBoardLayout() {
  const main = document.createElement('main');
  main.classList.add('container');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const gameOverMsg = document.createElement('div');
  gameOverMsg.classList.add('game-over-msg');

  const closeMsg = document.createElement('div');
  closeMsg.classList.add('close-msg');
  closeMsg.innerText = '✖';
  closeMsg.addEventListener('click', () => {
    overlay.classList.remove('show');
    gameOverMsg.classList.remove('show');
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
        chrckAndStartGame(tile);

        event.preventDefault();
        markTile(tile);
        checkGameEnd(tile);
      })
      board.appendChild(tileElem);

      boardArrayRow.push(tile);
    }

    boardArray.push(boardArrayRow);

  }

  const newGameBtn = document.createElement('button');
  newGameBtn.classList.add('new-game-btn');
  newGameBtn.innerText = 'Start new game'
  newGameBtn.addEventListener('click', () => {
    startNewGame();
  })

  gameOverMsg.appendChild(closeMsg);
  gameOverMsg.appendChild(textMsg);
  gameInfo.appendChild(steps);
  gameInfo.appendChild(time);
  main.appendChild(title);
  main.appendChild(gameInfo);
  main.appendChild(board);
  main.appendChild(overlay);
  main.appendChild(gameOverMsg);
  main.appendChild(newGameBtn);
  document.body.appendChild(main);

}

function chrckAndStartGame(tile) {
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
    tile.status = statuses.marked;
  }
}

function onTilePress(tile) {
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
  chrckAndStartGame(tile);

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
    msg = 'Game over. Try again';
  } else if (
    !boardArray.flat(2).some((element) =>
      element.status === statuses.hidden && !element.mine) ||
    !boardArray.flat(2).some((element) =>
      element.mine && element.status !== statuses.marked)
  ) {
    msg = `Hooray! You found all mines in ${timer} seconds and ${stepsCount} move(s)!`
  }

  if (msg) {
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

function startNewGame() {
  stopTimer();
  stepsCount = 0;
  timer = 0;
  document.querySelector('.steps').innerText = `Steps: ${stepsCount}`;
  document.querySelector('.time').innerText = `Time spent: ${timer} sec`;
  document.querySelector('.board').style.pointerEvents = "auto";

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

  window.addEventListener('load', () => {
    if (!+localStorage.timer) {
        createBoardLayout();
    } else {
      createBoardLayout();
    boardArray = JSON.parse(localStorage.getItem('boardArray'));
    stepsCount = +localStorage.getItem('stepsCount');
    gameRun = +localStorage.getItem('gameRun');
    timer = +localStorage.getItem('timer');
    timerInterval = +localStorage.getItem('timerInterval');
    }
  });
  
  // window.addEventListener('beforeunload', () => {
  //   localStorage.setItem('boardArray', JSON.stringify(boardArray));
  //   localStorage.setItem('stepsCount', JSON.stringify(stepsCount));
  //   localStorage.setItem('gameRun', JSON.stringify(gameRun));
  //   localStorage.setItem('timer', JSON.stringify(timer));
  //   localStorage.setItem('timerInterval', JSON.stringify(timerInterval));
  // });