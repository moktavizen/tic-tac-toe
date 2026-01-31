Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  return { getBoard };
})();

function Player(mark) {
  let score = 0;
  const markedGrids = [];

  const incrementScore = () => score++;
  const markGrid = (gridId) => markedGrids.push(gridId);
  const getMark = () => mark;
  const getScore = () => score;
  const getMarkedGrids = () => markedGrids;

  return {
    incrementScore,
    markGrid,
    getMark,
    getScore,
    getMarkedGrids,
  };
}

GameController = (function () {
  const playerX = Player("X");
  const playerO = Player("O");
  const getBoard = Gameboard.getBoard;
  const winningPatterns = [
    ["0", "1", "2"],
    ["3", "4", "5"],
    ["6", "7", "8"],
    ["0", "3", "6"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["0", "4", "8"],
    ["2", "4", "6"],
  ];
  let currPlayer = playerX;

  const getPlayerX = () => playerX;
  const getPlayerO = () => playerO;
  const getCurrPlayer = () => currPlayer;

  const checkWinner = (player) => {
    let isPlayerWinner = false;

    for (pattern of winningPatterns) {
      const winCon = pattern.every((el) => player.getMarkedGrids().includes(el));
      if (winCon) {
        isPlayerWinner = true;
        break;
      }
    }

    return isPlayerWinner;
  };

  const playRound = () => {
    let unmarkedGridCount = 9;
    do {
      currPlayer.markGrid(prompt(`${currPlayer.getMark()}'s turn to mark a grid`));

      unmarkedGridCount--;

      if (currPlayer.getMarkedGrids().length >= 3) {
        if (checkWinner(currPlayer)) {
          currPlayer.incrementScore();
          break;
        }
      }

      currPlayer = currPlayer === playerX ? playerO : playerX;
    } while (unmarkedGridCount > 0);

    console.log(playerX.getMarkedGrids());
    console.log(playerO.getMarkedGrids());
    console.log(playerX.getScore());
    console.log(playerO.getScore());
  };

  return {
    getPlayerX,
    getPlayerO,
    getCurrPlayer,
    getBoard,
    playRound,
  };
})();

DisplayController = (function () {
  const playerXMarkEl = document.querySelector(".player-x-mark");
  const playerXScoreEl = document.querySelector(".player-x-score");
  const playerOMarkEl = document.querySelector(".player-o-mark");
  const playerOScoreEl = document.querySelector(".player-o-score");
  const turnIndicatorEl = document.querySelector(".turn-indicator");
  const gameboardEl = document.querySelector(".gameboard");

  const renderScoreboard = () => {
    const playerX = GameController.getPlayerX();
    const playerO = GameController.getPlayerO();

    playerXMarkEl.textContent = playerX.getMark();
    playerXScoreEl.textContent = playerX.getScore();
    playerOMarkEl.textContent = playerO.getMark();
    playerOScoreEl.textContent = playerO.getScore();
  };

  const renderTurnIndicator = () => {
    const currPlayerMark = GameController.getCurrPlayer().getMark();

    turnIndicatorEl.classList.add(`player-${currPlayerMark.toLowerCase()}-mark`);
    turnIndicatorEl.textContent = `${currPlayerMark} Turn`;
  };

  const renderBoard = () => {
    const board = GameController.getBoard();

    board.forEach((grid, index) => {
      const gridButton = document.createElement("button");
      gridButton.classList.add("grid");
      gridButton.dataset.gridId = index;
      gameboardEl.appendChild(gridButton);
    });
  };

  renderScoreboard();
  renderTurnIndicator();
  renderBoard();
})();
