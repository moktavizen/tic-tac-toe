Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  return { getBoard };
})();

function Player(mark) {
  const score = 0;

  const incrementScore = () => score++;
  const getScore = () => score;

  return {
    mark,
    incrementScore,
    getScore,
  };
}

RoundController = (function () {
  const player1 = Player("X");
  const player2 = Player("O");

  console.log(player1);
  console.log(player2);
})();
