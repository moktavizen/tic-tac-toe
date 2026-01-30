Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  return { board };
})();

function Player(mark) {
  let score = 0;
  const markedGrids = [];

  const incrementScore = () => score++;
  const markGrid = (gridId) => markedGrids.push(gridId);
  const getScore = () => score;
  const getMarkedGrids = () => markedGrids;

  return {
    mark,
    incrementScore,
    markGrid,
    getScore,
    getMarkedGrids,
  };
}

RoundController = (function () {
  const player1 = Player("X");
  const player2 = Player("O");
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
      currPlayer.markGrid(prompt(`${currPlayer.mark}'s turn to mark a grid`));

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

  return { playRound };
})();

ConsoleController = (function () {
  RoundController.playRound();
})();
