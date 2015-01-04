/**
* Grid Module
*
* GridService
*/
angular.module('Grid', [])

.factory('GenerateUniqueId', function() {
  var generateUid = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  };
  return {
    next: function() { return generateUid(); }
  };
})
.factory('TileModel', function(GenerateUniqueId) {
  var Tile = function(pos, val) {
    this.x = pos.x;
    this.y = pos.y;
    this.value = val || 2;

    this.id = GenerateUniqueId.next();
    this.merged = null;
  };

  Tile.prototype.savePosition = function() {
    this.originalX = this.x;
    this.originalY = this.y;
  };

  Tile.prototype.setMergedBy = function(arr) {
    var self = this;
    arr.forEach(function(tile) {
      tile.merged = true;
      tile.updatePosition(self.getPosition());
    });
  };



  // Used by GridService.prepareTiles to reset all merged status
  Tile.prototype.reset = function() {
    this.merged = null;
  };

  Tile.prototype.updateValue = function(newValue) {
    this.value = newValue;
  };

  /********************************
  * Tile position getter and setter
  *********************************/ 

  Tile.prototype.getPosition = function() {
    return {
      x: this.x,
      y: this.y
    };
  };

  // updatePosition simply updates the x and y coordinates of the model
  Tile.prototype.updatePosition = function(newPosition) {
    this.x = newPosition.x;
    this.y = newPosition.y;
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

  // unit vectors used to determine which sequence of squares to iterate over
  var vectors = {
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 },
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 }
  };

  this.newTile = function(position, value) {
    return new TileModel(position, value);
  };

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
  * movement helper methods
  *********************************/  

  // this method used the unit vectors and returns the sequence of squares in the direction of the unit vector
  this.traversalDirections = function(key) {
    var vector = vectors[key];
    var positions = {x: [], y: []};
    for (var i = 0; i < this.size; i++) {
      positions.x.push(i);
      positions.y.push(i);
    }

    // reorder if going right
    if (vector.x > 0) {
      positions.x = positions.x.reverse();
    }

    // reoreder if going down
    if (vector.y > 0) {
      positions.y = positions.y.reverse();
    }
    return positions;
  };

  this.calculateNextPosition = function(cell, key) {
    var vector = vectors[key];
    var previous;

    do {
      previous = cell;
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      };
    } while (
      this.withinGrid(cell) && this.cellAvailable(cell)
    );

    return {
      newPosition: previous,
      next: this.getCellAt(cell)
    };
  };

  this.prepareTiles = function() {
    this.forEach(function(x, y, tile) {
      if (tile) {
        tile.reset();
      }
    });
  };

  /********************************
  * movement methods
  *********************************/  

  // in order to keep track of the tiles on the back end, we need to update the this.tiles array in GridService and update the tile object's position.

  this.moveTile = function(tile, newPosition) {
    var oldPos = {
      x: tile.x,
      y: tile.y
    };

    // set old position to null
    this.setCellAt(oldPos, null);
    // set new position to the tile
    this.setCellAt(newPosition, tile);

    // updatePosition simply updates the x and y coordinates of the model and can be found in TileModel
    tile.updatePosition(newPosition);
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

  // is a cell available at a given position?
  this.cellAvailable = function(cell) {
    if (this.withinGrid(cell)) {
      return !this.getCellAt(cell);
    } else {
      return null;
    }
  };

  this.anyCellsAvailable = function() {
    return this.availableCells().length > 0;
  };

  this.tileMatchesAvailable = function() {
    var totalSize = service.size * service.size;
    for (var i = 0; i < totalSize; i++) {
      var pos = this._positionToCoordinates(i);
      var tile = this.tiles[i];

      if (tile) {
        // Check all vectors
        for (var vectorName in vectors) {
          var vector = vectors[vectorName];
          var cell = { x: pos.x + vector.x, y: pos.y + vector.y };
          var other = this.getCellAt(cell);
          if (other && other.value === tile.value) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // check if 2 tiles are in the same position
  this.samePositions = function(a, b) {
    return a.x === b.x && a.y === b.y;
  };

  // returns all available positions
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
