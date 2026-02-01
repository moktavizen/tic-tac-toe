Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  return { getBoard };
})();

function Player(mark) {
  const getMark = () => mark;

  let score = 0;
  const incrementScore = () => score++;
  const getScore = () => score;

  const markedGrids = [];
  const markGrid = (gridId) => markedGrids.push(gridId);
  const resetMarkedGrids = () => (markedGrids.length = 0);
  const getMarkedGrids = () => markedGrids;

  const winningPattern = [];
  const setWinningPattern = (pattern) => {
    winningPattern.length = 0;
    winningPattern.push(...pattern);
  };
  const resetWinningPattern = () => (winningPattern.length = 0);
  const getWinningPattern = () => winningPattern;

  return {
    getMark,
    incrementScore,
    getScore,
    markGrid,
    resetMarkedGrids,
    getMarkedGrids,
    setWinningPattern,
    resetWinningPattern,
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

  const resetCurrPlayer = () => {
    currPlayer = playerX;
  };

  const decreaseUnmarkedGridCount = () => {
    unmarkedGridCount--;
  };

  const resetUnmarkedGridCount = () => {
    unmarkedGridCount = 9;
  };

  return {
    getPlayerX,
    getPlayerO,
    getCurrPlayer,
    getBoard: Gameboard.getBoard,
    checkResult,
    switchPlayer,
    resetCurrPlayer,
    decreaseUnmarkedGridCount,
    resetUnmarkedGridCount,
  };
})();

DisplayController = (function () {
  const playerXMarkEl = document.querySelector(".player-x-mark");
  const playerXScoreEl = document.querySelector(".player-x-score");
  const playerOMarkEl = document.querySelector(".player-o-mark");
  const playerOScoreEl = document.querySelector(".player-o-score");
  const vsEL = document.querySelector(".vs");

  const playerX = GameController.getPlayerX();
  const playerO = GameController.getPlayerO();

  const renderScoreboard = () => {
    playerXMarkEl.textContent = playerX.getMark();
    playerXScoreEl.textContent = playerX.getScore();
    playerOMarkEl.textContent = playerO.getMark();
    playerOScoreEl.textContent = playerO.getScore();
    vsEL.textContent = "VS";
  };

  const statusEl = document.querySelector(".status");

  const renderStatus = () => {
    statusEl.classList.add(`player-${playerX.getMark().toLowerCase()}-mark`);
    statusEl.textContent = `${playerX.getMark()} Turn`;
  };

  const board = GameController.getBoard();
  const gameboardEl = document.querySelector(".gameboard");

  const renderBoard = () => {
    board.forEach((_, index) => {
      const gridBtn = document.createElement("button");
      gridBtn.classList.add("grid");
      gridBtn.dataset.gridId = index;
      gameboardEl.appendChild(gridBtn);
    });
  };

  const actionBtn = document.querySelector(".action-btn");

  const renderActionBtn = () => (actionBtn.textContent = "Restart");

  const initialRender = () => {
    renderScoreboard();
    renderStatus();
    renderBoard();
    renderActionBtn();
  };

  initialRender();

  const updateGrid = (gridEl, playerMark) => {
    gridEl.textContent = playerMark;
    gridEl.classList.add(`player-${playerMark.toLowerCase()}-mark`);
    gridEl.setAttribute("disabled", "");
  };

  const renderResult = (msg, playerMark, playerWinningPattern) => {
    playerXScoreEl.textContent = playerX.getScore();
    playerOScoreEl.textContent = playerO.getScore();

    statusEl.classList.remove(`player-${playerX.getMark().toLowerCase()}-mark`);
    statusEl.classList.remove(`player-${playerO.getMark().toLowerCase()}-mark`);
    statusEl.classList.add("result");
    if (msg === "DRAW!") {
      statusEl.classList.add("draw");
    } else {
      statusEl.classList.add(`player-${playerMark.toLowerCase()}-mark`);
    }

    statusEl.textContent = msg;

    const gridBtnEls = document.querySelectorAll(".grid");
    for (el of gridBtnEls) {
      el.setAttribute("disabled", "");
    }

    actionBtn.textContent = "Continue";

    if (!playerWinningPattern) return;
    for (gridId of playerWinningPattern) {
      gridEl = document.querySelector(`[data-grid-id="${gridId}"]`);
      gridEl.classList.add("winner-grid");
    }
  };

  const updateStatus = (playerMark) => {
    statusEl.classList.remove(`draw`);
    statusEl.classList.remove(`result`);
    statusEl.classList.remove(`player-${playerX.getMark().toLowerCase()}-mark`);
    statusEl.classList.remove(`player-${playerO.getMark().toLowerCase()}-mark`);
    statusEl.classList.add(`player-${playerMark.toLowerCase()}-mark`);
    statusEl.textContent = `${playerMark} Turn`;
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
    } else {
      GameController.switchPlayer();
      currPlayer = GameController.getCurrPlayer();
      updateStatus(currPlayer.getMark());
    }
  });

  actionBtn.addEventListener("click", () => {
    actionBtn.textContent =
      actionBtn.textContent === "Continue" ? "Restart" : actionBtn.textContent;

    playerX.resetMarkedGrids();
    playerO.resetMarkedGrids();
    playerX.resetWinningPattern();
    playerO.resetWinningPattern();
    GameController.resetCurrPlayer();
    updateStatus(GameController.getCurrPlayer().getMark());

    gameboardEl.replaceChildren();
    renderBoard();
    GameController.resetUnmarkedGridCount();
  });
})();
