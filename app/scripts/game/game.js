/**
* Game Module
*
* Game logic.
*/
angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function(GridService) {

    this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    this.gameSize = 4;

    // Create a new game
    this.newGame = function() {
      GridService.buildEmptyGameBoard();
      GridService.buildStartingPosition();
    };
    // reinitialize the game
    this.reinit = function() {
      this.gameOver = false;
      this.win = false;
      this.currentScore = 0;
      this.highScore = 0;
    };
    // Handle the move action
    this.move = function() {};
    // Update the core
    this.updateScore = function(newScore) {};
    // Are there moves left?
    this.movesAvailable = function() {
      return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
    };
});