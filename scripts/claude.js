const Gameboard = (() => {
  const board = Array(9).fill("");
  const getBoard = () => board;
  const reset = () => board.fill("");
  return { getBoard, reset };
})();

function Player(mark) {
  let score = 0;
  let markedGrids = [];
  let winningPattern = [];

  return {
    getMark: () => mark,
    getScore: () => score,
    incrementScore: () => score++,
    markGrid: (id) => markedGrids.push(id),
    getMarkedGrids: () => markedGrids,
    setWinningPattern: (pattern) => (winningPattern = [...pattern]),
    getWinningPattern: () => winningPattern,
    reset: () => {
      markedGrids = [];
      winningPattern = [];
    },
  };
}

const GameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let currPlayer = playerX;
  let movesLeft = 9;

  const checkResult = (player) => {
    const marked = player.getMarkedGrids();
    if (marked.length < 3) return null;

    for (let pattern of winPatterns) {
      if (pattern.every((pos) => marked.includes(String(pos)))) {
        player.setWinningPattern(pattern.map(String));
        player.incrementScore();
        return `${player.getMark()} WINNER!`;
      }
    }
    return movesLeft === 0 ? "DRAW!" : null;
  };

  const playTurn = (gridId) => {
    currPlayer.markGrid(gridId);
    movesLeft--;
    const result = checkResult(currPlayer);
    if (!result) currPlayer = currPlayer === playerX ? playerO : playerX;
    return result;
  };

  const resetRound = () => {
    playerX.reset();
    playerO.reset();
    Gameboard.reset();
    currPlayer = playerX;
    movesLeft = 9;
  };

  return {
    getPlayerX: () => playerX,
    getPlayerO: () => playerO,
    getCurrPlayer: () => currPlayer,
    playTurn,
    resetRound,
  };
})();

const DisplayController = (() => {
  const playerX = GameController.getPlayerX();
  const playerO = GameController.getPlayerO();
  const statusEl = document.querySelector(".status");
  const gameboardEl = document.querySelector(".gameboard");
  const actionBtn = document.querySelector(".action-btn");

  const updateScoreboard = () => {
    document.querySelector(".player-x-mark").textContent = playerX.getMark();
    document.querySelector(".player-x-score").textContent = playerX.getScore();
    document.querySelector(".player-o-mark").textContent = playerO.getMark();
    document.querySelector(".player-o-score").textContent = playerO.getScore();
  };

  const updateStatus = (mark) => {
    statusEl.className = `status player-${mark.toLowerCase()}-mark`;
    statusEl.textContent = `${mark} Turn`;
  };

  const renderBoard = () => {
    gameboardEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement("button");
      btn.className = "grid";
      btn.dataset.gridId = i;
      gameboardEl.appendChild(btn);
    }
  };

  const showResult = (msg, winner) => {
    updateScoreboard();
    statusEl.className = `status result ${msg === "DRAW!" ? "draw" : `player-${winner.getMark().toLowerCase()}-mark`}`;
    statusEl.textContent = msg;
    actionBtn.textContent = "Continue";

    document.querySelectorAll(".grid").forEach((el) => (el.disabled = true));

    winner.getWinningPattern().forEach((id) => {
      document.querySelector(`[data-grid-id="${id}"]`).classList.add("winner-grid");
    });
  };

  gameboardEl.addEventListener("click", (e) => {
    if (!e.target.dataset.gridId || e.target.disabled) return;

    const currPlayer = GameController.getCurrPlayer();
    e.target.textContent = currPlayer.getMark();
    e.target.className = `grid player-${currPlayer.getMark().toLowerCase()}-mark`;
    e.target.disabled = true;

    const result = GameController.playTurn(e.target.dataset.gridId);
    if (result) {
      showResult(result, currPlayer);
    } else {
      updateStatus(GameController.getCurrPlayer().getMark());
    }
  });

  actionBtn.addEventListener("click", () => {
    GameController.resetRound();
    renderBoard();
    updateStatus(playerX.getMark());
    actionBtn.textContent = "Restart";
  });

  updateScoreboard();
  updateStatus(playerX.getMark());
  renderBoard();
  actionBtn.textContent = "Restart";
})();
