/**
* Grid Module
*
* GridService
*/
angular.module('Grid', [])

.factory('TileModel', function() {
  var Tile = function(pos, val) {
    this.x = pos.x;
    this.y = pos.y;
    this.value = val || 2;
  };

  return Tile;
})

.service('GridService', function (TileModel) {
  this.grid = [];
  this.tiles = [];
  this.startingTileNumber = 2;

  var service = this;

  // size of the board
  this.size = 4;

  this.tiles.push(new TileModel({x: 1, y: 2}, 2));
  this.tiles.push(new TileModel({x: 1, y: 1}, 2));

  // buildEmptyGameBoard method in GridService
  this.buildEmptyGameBoard = function() {
    var self = this;

    // initialize grid
    for (var i = 0; i < service.size * service.size; i++) {
      this.grid[i] = null;
    }

    // initialize tile array
    this.forEach(function(x,y) {
      self.setCellAt({x: x,y: y}, null);
    });
  };

  // make starting position
  this.buildStartingPosition = function() {
    for (var i = 0; i < this.startingTileNumber; i++) {
      this.randomlyInsertNewTile();
    }
  };

  /********************************
  * helper methods
  *********************************/

  // run a method for each element in the tiles array
  this.forEach = function(callback) {

    // get area
    var totalSize = this.size * this.size;

    for (var i = 0; i < totalSize; i++) {
      var pos = this._positionToCoordinates(i);
      callback(pos.x, pos.y, this.tiles[i]);
    }
  };

  // check if the position is within the grid
  this.withinGrid = function(cell) {
    return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size;
  };

  this.availableCells = function() {
    var cells = [],
        self  = this;

    this.forEach(function(x,y) {
      var foundTile = self.getCellAt({x: x, y: y});
      // if tile is not occupied, it's available
      if (!foundTile) {
        cells.push({x: x, y: y});
      }
    });

    return cells;

  };

  this.randomAvailableCell = function() {
    var cells = this.availableCells();
    if (cells.length > 0) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  };

  this.randomlyInsertNewTile = function() {
    var cell = this.randomAvailableCell(),
        tile = new TileModel(cell, 2);

    this.insertTile(tile);
  };



  /*
  * Tile insertion and removal
  */

  this.insertTile = function(tile) {
    var pos = this._coordinatesToPosition(tile);
    this.tiles[pos] = tile;
  };

  this.removeTile = function(pos) {
    pos = this._coordinatesToPosition(pos);
    delete this.tiles[pos];
  };

  /*
  * Cell getters and setters
  */

  // get a cell at a particular position
  this.getCellAt = function(pos) {
    if (this.withinGrid(pos)) {
      var x = this._coordinatesToPosition(pos);
      return this.tiles[x];
    } else {
      return null;
    }
  };

  // set a cell at a position
  this.setCellAt = function(pos, tile) {
    if (this.withinGrid(pos)) {
      var x = this._coordinatesToPosition(pos);
      this.tiles[x] = tile;
    }
  };




  /*
  * position <-> coordinate changers
  */

  // Helper to convert x to x,y
  this._positionToCoordinates = function(i) {
    var x = i % service.size,
        y = (i - x) / service.size;
    return {
      x: x,
      y: y
    };
  };

  // Helper to convert coordinates to position
  this._coordinatesToPosition = function(pos) {
    return (pos.y * service.size) + pos.x;
  };
  
});
