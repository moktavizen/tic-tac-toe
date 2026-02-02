const Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const setCell = (index, mark) => {
    if (!board[index]) board[index] = mark;
  };
  const reset = () => board.fill("");

  return { getBoard, setCell, reset };
})();

function Player(mark) {
  let score = 0;
  return {
    mark,
    getScore: () => score,
    addScore: () => score++,
  };
}

const GameController = (function () {
  const playerX = Player("X");
  const playerO = Player("O");
  let currPlayer = playerX;
  let isGameOver = false;
  let resultMsg = "";

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Cols
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  const playRound = (index) => {
    if (isGameOver || Gameboard.getBoard()[index] !== "") return;

    Gameboard.setCell(index, currPlayer.mark);

    if (checkWin()) {
      isGameOver = true;
      resultMsg = `${currPlayer.mark} WINS!`;
      currPlayer.addScore();
    } else if (!Gameboard.getBoard().includes("")) {
      isGameOver = true;
      resultMsg = "DRAW!";
    } else {
      currPlayer = currPlayer === playerX ? playerO : playerX;
    }
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    return winPatterns.some((pattern) =>
      pattern.every((index) => board[index] === currPlayer.mark),
    );
  };

  const restartGame = () => {
    Gameboard.reset();
    currPlayer = playerX;
    isGameOver = false;
    resultMsg = "";
  };

  return {
    playRound,
    restartGame,
    getPlayerX: () => playerX,
    getPlayerO: () => playerO,
    getCurrPlayer: () => currPlayer,
    getIsGameOver: () => isGameOver,
    getResultMsg: () => resultMsg,
  };
})();

const DisplayController = (function () {
  const gameboardEl = document.querySelector(".gameboard");
  const statusEl = document.querySelector(".status");
  const actionBtn = document.querySelector(".action-btn");
  const scores = {
    X: document.querySelector(".player-x-score"),
    O: document.querySelector(".player-o-score"),
  };

  const render = () => {
    // 1. Render Board
    gameboardEl.innerHTML = "";
    Gameboard.getBoard().forEach((mark, index) => {
      const btn = document.createElement("button");
      btn.classList.add("grid");
      btn.textContent = mark;
      btn.disabled = mark !== "" || GameController.getIsGameOver();
      btn.onclick = () => {
        GameController.playRound(index);
        render();
      };
      gameboardEl.appendChild(btn);
    });

    // 2. Render Status
    if (GameController.getIsGameOver()) {
      statusEl.textContent = GameController.getResultMsg();
      actionBtn.textContent = "Restart Game";
    } else {
      statusEl.textContent = `${GameController.getCurrPlayer().mark}'s Turn`;
      actionBtn.textContent = "Restart Board";
    }

    // 3. Render Scores
    scores.X.textContent = GameController.getPlayerX().getScore();
    scores.O.textContent = GameController.getPlayerO().getScore();
  };

  actionBtn.addEventListener("click", () => {
    GameController.restartGame();
    render();
  });

  // Initial Render
  render();
})();
