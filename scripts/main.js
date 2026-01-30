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
  const player1 = Player("X");
  const player2 = Player("O");
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
  let currPlayer = player1;

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;
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

      currPlayer = currPlayer === player1 ? player2 : player1;
    } while (unmarkedGridCount > 0);

    console.log(player1.getMarkedGrids());
    console.log(player2.getMarkedGrids());
    console.log(player1.getScore());
    console.log(player2.getScore());
  };

  return {
    getPlayer1,
    getPlayer2,
    getCurrPlayer,
    getBoard,
    playRound,
  };
})();

DisplayController = (function () {
  const player1El = document.querySelector(".player-1");
  const player1ScoreEl = document.querySelector(".player-1-score");
  const player2El = document.querySelector(".player-2");
  const player2ScoreEl = document.querySelector(".player-2-score");
  const turnIndicatorEl = document.querySelector(".turn-indicator");
  const gameboardEl = document.querySelector(".gameboard");

  const renderScoreboard = () => {
    const player1 = GameController.getPlayer1();
    const player2 = GameController.getPlayer2();

    player1El.textContent = player1.getMark();
    player1ScoreEl.textContent = player1.getScore();
    player2El.textContent = player2.getMark();
    player2ScoreEl.textContent = player2.getScore();
  };

  const renderTurnIndicator = () => {
    const currPlayerMark = GameController.getCurrPlayer().getMark();

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
