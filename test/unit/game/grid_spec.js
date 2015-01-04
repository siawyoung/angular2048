describe('Grid', function() {

  beforeEach(module('Grid'));

  describe('GridService', function() {
    var gridService, tileModel;
    beforeEach(inject(function(GridService, TileModel) {
      gridService = GridService;
      tileModel = TileModel;
    }));

    describe('.buildEmptyGameBoard', function() {
      var nullArr;

      // create a null array to compare against
      beforeEach(function() {
        nullArr = [];
        for (var i = 0; i < 16; i++) {
          nullArr.push(null);
        }
      })

      it('should clear out the grid array with nulls', function() {
        var grid = [];
        for (var i = 0; i < 16; i++) {
          grid.push(i);
        }
        gridService.grid = grid;

        // after calling buildEmptyGameBoard
        // grid should be the same as a null array
        gridService.buildEmptyGameBoard();
        expect(gridService.grid).toEqual(nullArr);
      });

      it('should clear out the tiles array with nulls', function() {
        var tiles = [];
        for (var i = 0; i < 16; i++) {
          tiles.push(i);
        }
        gridService.tiles = tiles;

        // after calling buildEmptyGameBoard
        // grid should be the same as a null array
        gridService.buildEmptyGameBoard();
        expect(gridService.tiles).toEqual(nullArr);
      });
    });
  });
});