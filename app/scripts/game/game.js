/**
* Game Module
*
* Game logic.
*/
angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore) {

    this.getHighScore = function() {
      return parseInt($cookieStore.get('highScore')) || 0;
    };

    this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    this.gameSize = 4;
    this.winningValue = 2048;

    // Create a new game
    this.newGame = function() {
      GridService.buildEmptyGameBoard();
      GridService.buildStartingPosition();
      this.reinit();
    };
    // reinitialize the game
    this.reinit = function() {
      this.gameOver = false;
      this.win = false;
      this.currentScore = 0;
      this.highScore = this.getHighScore;
    };
    this.reinit();

    // Handle the move action
    this.move = function(key) {
      // set aside reference to GameManager for later
      var self = this;

      var moveFunction = function() {

      if (self.win) {
        return false;
      }

      var positions = GridService.traversalDirections(key);

      // boolean to check if the value of 2048 has been reached
      var hasWon = false;
      // boolean to check if any tiles have been moved, because we only want generate new tiles if tiles have been moved
      var hasMoved = false;

      // reset merged state
      GridService.prepareTiles();

      // for every position...
      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var originalPosition = {x: x, y: y};
          var tile = GridService.getCellAt(originalPosition);
          // if a tile exists here
          if (tile) {
            var cell = GridService.calculateNextPosition(tile, key);
            var next = cell.next;
            

            // this branch handles merges
            if (next && next.value === tile.value && !next.merged) {
              
              var newValue = tile.value * 2;

              // create a new tile
              var mergedTile = GridService.newTile(tile, newValue);
              mergedTile.merged = [tile, cell.next];

              // insert the new tile
              GridService.insertTile(mergedTile);

              // remove the old tile
              GridService.removeTile(tile);

              // remove the lcation of the mergedTile into the next position
              GridService.moveTile(mergedTile, next);

              self.updateScore(self.currentScore + newValue);

              if (mergedTile.value >= self.winningValue) {
                hasWon = true;
              }

              hasMoved = true;
            } else {
              // handle moving tile
              GridService.moveTile(tile, cell.newPosition);
            }

            if (!GridService.samePositions(originalPosition, cell.newPosition)) {
              hasMoved = true;
            }
          }
        });
      });

      if (hasWon && !self.win) {
        self.win = true;
      }

      if (hasMoved) {
        GridService.randomlyInsertNewTile();

        // if the game is won or no more moves are available, the game is over.
        if (self.win || !self.movesAvailable()) {
          self.gameOver = true;
        }
      }

    };

    return $q.when(moveFunction());

    };

    // Update the score
    this.updateScore = function(newScore) {
      this.currentScore = newScore;
      if (this.currentScore > this.getHighScore()) {
        this.highScore = newScore;
        $cookieStore.put('highScore', newScore);
      }
    };

    // Are there moves left?
    this.movesAvailable = function() {
      return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
    };
});