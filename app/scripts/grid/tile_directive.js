angular.module('Grid')
.directive('tile', function(){
  // Runs during compile
  return {
    scope: {
      ngModel: '='
    },
    restrict: 'A',
    templateUrl: 'scripts/grid/tile.html',

  };
});