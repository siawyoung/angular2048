angular.module('Keyboard', [])
.service('KeyboardService', function($document) {

  var UP = 'up', RIGHT = 'right', DOWN = 'down', LEFT = 'left';

  var keyboardMap = {
    37: LEFT,
    38: UP,
    39: RIGHT,
    40: DOWN
  };
  
  this.init = function() {
    var self = this;
    this.keyEventHandlers = [];

    $document.bind('keydown', function(event) {
      var key = keyboardMap[event.which];

      if (key) {
        event.preventDefault();
        // fires the handle key event, which iterates through all event handlers that are registered with this service
        self._handleKeyEvent(key, event);
      }
    });

  };

  // this function allows a event handler to register itself as a listener on the keyboard service
  this.on = function(callback) {
    this.keyEventHandlers.push(callback);
  };

  // this function's responsibility is to call every event handler registered
  this._handleKeyEvent = function(key, event) {

    var callbacks = this.keyEventHandlers;
    if (!callbacks) { 
      return; 
    }

    event.preventDefault();

    if (callbacks) {
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        callback(key, event);
      }
    }
  };

});