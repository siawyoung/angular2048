/**
* Grid Module
*
* Grid directive
*/
angular.module('Grid')
.directive('grid', function() {
  // Runs during compile
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'scripts/grid/grid.html'
  };
});