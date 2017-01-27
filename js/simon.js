

var game = {
  sequence: [],
  currentLevel: 0,
  gameOver: 0,

  init: function() {
    this.newGame();
  },

  startNewGame: function() {
    for (var i = 0; i < 20; i++) {
      this.sequence[i] = getRandomInt(0, 3);
    }
    this.currentLevel = 5;
    this.gameOver = 0;
  },

    flash: function(sID) {
    //that.playSound(pad);
    console.log("flashing " + sID);
    $("#section" + sID).stop().animate({
      opacity: '1'
    }, {
      duration: 200,
      complete: function() {
        $("#section" + sID).stop().animate({
          opacity: '.5'
        }, 500);
      }
    });
  },
  
  playbackCurrent: function() {
    console.log(this.sequence);
    for (var i = 0; i < this.currentLevel; i++) {
      console.log("should flash " + this.sequence[i]);
      setTimeout(function() {
        this.flash(this.sequence[i]);
      }, 1000 * i);
    }
  }
};


$(document).ready(function() {
  game.init();
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}