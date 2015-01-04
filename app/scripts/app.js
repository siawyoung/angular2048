angular
.module('twentyfourtyeightApp', ['Game','Grid', 'Keyboard'])
.controller('GameController', function(GameManager){
    this.game = GameManager;

    this.newGame = function() {
      this.game.newGame();
    };

    this.newGame();
});