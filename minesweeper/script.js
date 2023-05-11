
function createBoardLayout() {
  const main = document.createElement('main');
  main.classList.add('container');

  const title = document.createElement('h1');
  title.classList.add('title');
  title.innerText = 'Minesweeper game';

  const gameInfo = document.createElement('div');
  gameInfo.classList.add('game-info');

  const steps = document.createElement('div');
  steps.classList.add('steps')
  steps.innerText = 'Steps: ';

  const time = document.createElement('div');
  time.classList.add('time')
  time.innerText = 'Time spent: ';

  const board = document.createElement('div');
  board.classList.add('board')

  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
  }

  gameInfo.appendChild(steps);
  gameInfo.appendChild(time);
  main.appendChild(title);
  main.appendChild(gameInfo);
  main.appendChild(board);
  document.body.appendChild(main);

}
