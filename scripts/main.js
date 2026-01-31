Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  return { getBoard };
})();

function Player(mark) {
  let score = 0;
  const markedGrids = [];
  let winningPattern;

  const incrementScore = () => score++;
  const markGrid = (gridId) => markedGrids.push(gridId);
  const getMark = () => mark;
  const getScore = () => score;
  const getMarkedGrids = () => markedGrids;
  const setWinningPattern = (pattern) => {
    winningPattern = pattern;
  };
  const getWinningPattern = () => winningPattern;

  return {
    incrementScore,
    markGrid,
    getMark,
    getScore,
    getMarkedGrids,
    setWinningPattern,
    getWinningPattern,
  };
}

GameController = (function () {
  const playerX = Player("X");
  const playerO = Player("O");
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
  let unmarkedGridCount = 9;

  const getPlayerX = () => playerX;
  const getPlayerO = () => playerO;
  const getCurrPlayer = () => currPlayer;

  const checkResult = (player) => {
    if (player.getMarkedGrids().length < 3) return;

    let msg = "";
    for (pattern of winningPatterns) {
      const winCon = pattern.every((el) => player.getMarkedGrids().includes(el));
      if (winCon) {
        player.setWinningPattern(pattern);
        msg = `${player.getMark()} WINNER!`;
        player.incrementScore();
        break;
      }
    }

    if (!msg && !unmarkedGridCount) {
      msg = "DRAW!";
    }

    return msg;
  };

  const switchPlayer = () => {
    currPlayer = currPlayer === playerX ? playerO : playerX;
  };

  const decreaseUnmarkedGridCount = () => {
    unmarkedGridCount--;
  };

  return {
    getPlayerX,
    getPlayerO,
    getCurrPlayer,
    getBoard: Gameboard.getBoard,
    checkResult,
    switchPlayer,
    decreaseUnmarkedGridCount,
  };
})();

DisplayController = (function () {
  const playerXMarkEl = document.querySelector(".player-x-mark");
  const playerXScoreEl = document.querySelector(".player-x-score");
  const playerOMarkEl = document.querySelector(".player-o-mark");
  const playerOScoreEl = document.querySelector(".player-o-score");
  const turnIndicatorEl = document.querySelector(".turn-indicator");
  const gameboardEl = document.querySelector(".gameboard");

  const playerX = GameController.getPlayerX();
  const playerO = GameController.getPlayerO();
  const board = GameController.getBoard();

  const initialRender = () => {
    playerXMarkEl.textContent = playerX.getMark();
    playerXScoreEl.textContent = playerX.getScore();
    playerOMarkEl.textContent = playerO.getMark();
    playerOScoreEl.textContent = playerO.getScore();

    turnIndicatorEl.classList.add(`player-${playerX.getMark().toLowerCase()}-mark`);
    turnIndicatorEl.textContent = `${playerX.getMark()} Turn`;

    board.forEach((_, index) => {
      const gridButton = document.createElement("button");
      gridButton.classList.add("grid");
      gridButton.dataset.gridId = index;
      gameboardEl.appendChild(gridButton);
    });
  };

  initialRender();

  const updateGrid = (gridEl, playerMark) => {
    gridEl.textContent = playerMark;
    gridEl.classList.add(`player-${playerMark.toLowerCase()}-mark`);
    gridEl.setAttribute("disabled", "");
  };

  const updateTurnIndicator = (playerMark) => {
    turnIndicatorEl.classList.remove(`player-${playerX.getMark().toLowerCase()}-mark`);
    turnIndicatorEl.classList.remove(`player-${playerO.getMark().toLowerCase()}-mark`);
    turnIndicatorEl.classList.add(`player-${playerMark.toLowerCase()}-mark`);
    turnIndicatorEl.textContent = `${playerMark} Turn`;
  };

  const scoreboardEl = document.querySelector(".scoreboard");
  const gridButtonEls = document.querySelectorAll(".grid");

  const renderResult = (msg, playerMark, playerWinningPattern) => {
    scoreboardEl.replaceChildren();
    scoreboardEl.classList.add("result");

    if (msg === "DRAW!") {
      scoreboardEl.classList.add("draw");
    } else {
      scoreboardEl.classList.add(`player-${playerMark.toLowerCase()}-mark`);
    }

    scoreboardEl.textContent = msg;

    for (el of gridButtonEls) {
      el.setAttribute("disabled", "");
    }

    if (!playerWinningPattern) return;
    for (gridId of playerWinningPattern) {
      gridEl = document.querySelector(`[data-grid-id="${gridId}"]`);
      gridEl.classList.add("winner-grid");
    }
  };

  gameboardEl.addEventListener("click", (ev) => {
    const selectedGridEl = ev.target;
    const selectedGridId = selectedGridEl.dataset.gridId;

    if (!selectedGridId) return;

    let currPlayer = GameController.getCurrPlayer();

    currPlayer.markGrid(selectedGridId);
    updateGrid(selectedGridEl, currPlayer.getMark());
    GameController.decreaseUnmarkedGridCount();

    const resultMsg = GameController.checkResult(currPlayer);
    if (resultMsg) {
      renderResult(resultMsg, currPlayer.getMark(), currPlayer.getWinningPattern());
    }

    GameController.switchPlayer();
    currPlayer = GameController.getCurrPlayer();
    updateTurnIndicator(currPlayer.getMark());
  });
})();
