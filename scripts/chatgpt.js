const Gameboard = (() => {
  const board = Array(9).fill(null);

  const getBoard = () => board;
  const setCell = (index, mark) => (board[index] = mark);
  const reset = () => board.fill(null);

  return { getBoard, setCell, reset };
})();

const Player = (mark) => {
  let score = 0;

  return {
    mark,
    getScore: () => score,
    win: () => score++,
  };
};

const GameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let currentPlayer = playerX;

  const WIN_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const playMove = (index) => {
    const board = Gameboard.getBoard();
    if (board[index]) return null;

    Gameboard.setCell(index, currentPlayer.mark);

    if (isWinner(currentPlayer.mark)) {
      currentPlayer.win();
      return { winner: currentPlayer.mark };
    }

    if (board.every(Boolean)) return { draw: true };

    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    return { next: currentPlayer.mark };
  };

  const isWinner = (mark) =>
    WIN_PATTERNS.some((pattern) => pattern.every((i) => Gameboard.getBoard()[i] === mark));

  const reset = () => {
    Gameboard.reset();
    currentPlayer = playerX;
  };

  return {
    playMove,
    reset,
    getPlayers: () => ({ playerX, playerO }),
    getCurrentMark: () => currentPlayer.mark,
  };
})();

const DisplayController = (() => {
  const boardEl = document.querySelector(".gameboard");
  const statusEl = document.querySelector(".status");
  const restartBtn = document.querySelector(".action-btn");

  const { playerX, playerO } = GameController.getPlayers();

  const renderBoard = () => {
    boardEl.replaceChildren();
    Gameboard.getBoard().forEach((mark, i) => {
      const btn = document.createElement("button");
      btn.textContent = mark ?? "";
      btn.dataset.index = i;
      btn.disabled = Boolean(mark);
      boardEl.appendChild(btn);
    });
  };

  const renderStatus = (text) => (statusEl.textContent = text);

  boardEl.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index == null) return;

    const result = GameController.playMove(Number(index));
    renderBoard();

    if (result?.winner) {
      renderStatus(`${result.winner} wins!`);
    } else if (result?.draw) {
      renderStatus("Draw!");
    } else {
      renderStatus(`${GameController.getCurrentMark()} turn`);
    }
  });

  restartBtn.addEventListener("click", () => {
    GameController.reset();
    renderBoard();
    renderStatus("X turn");
  });

  renderBoard();
  renderStatus("X turn");
})();
