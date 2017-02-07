var game = {
  sequence: [], //the full sequence of flashes
  gameLevel: 0,  //the level the user is up too 
  gameOver: 0,
  usersTurn: false, //whether it is the users turn or not (only count presses if it is there turn)
  userTurnLevel: 0,  //the position in the sequence the user is currently guessing
  UPHandlerinitialised: false, // whether the press section handler is initialised
  mode: 'normal',
  GAMELENGTH: 20, //sets the number of levels in the game

  init: function () {
    var that = this;
    if (this.UPHandlerinitialised === false) {		//checks to see if handlers are already active
      this.initUserPressHandler();		//if not activate them
      $('[data-action=start]').on('click', function () {
        that.startNewGame();
      });
      $('input[name=mode]').on('change', function (e) {
        that.changeMode(e);
      });
    }
    $('p[data-action="lose"]').hide();
    $('p[data-action="wrong"]').hide();
    $('p[data-action="win"]').hide();
  },

  startNewGame: function () {
    for (var i = 0; i < this.GAMELENGTH; i++) {
      this.sequence[i] = getRandomInt(0, 3);
    }
    this.clearTimeouts();
    this.usersTurn = true;
    if (this.mode !== 'free') {
      this.gameLevel = 1;
      this.userTurnLevel = 0;
      $('[data-level]').text(this.gameLevel);
    } else {
      $('[data-level]').text('free play');
    }
    this.gameOver = 0;
    $('p[data-action="lose"]').hide();
    $('p[data-action="wrong"]').hide();
    $('p[data-action="win"]').hide();
    if (this.mode !== 'free') {
      this.playbackCurrent();
    }
  },

  flash: function (sID) {
    this.playSound(sID);
    console.log("flashing " + sID);
    var $section = $('[data-section=' + sID + ']').addClass('lit');
    window.setTimeout(function () {
      $section.removeClass('lit');
    }, 500);
  },

  changeMode: function (e) {
    this.mode = e.target.value;
    this.startNewGame();
  },

  playSound: function (sID) {
    var soundID = sID + 1;
    var soundFile = 'https://s3.amazonaws.com/freecodecamp/simonSound' + soundID + '.mp3';
    var audio = new Audio(soundFile);
    audio.play();
  },

  initUserPressHandler: function () {
    var that = this;
    $('.section').on('mouseup', function () {
      if (that.usersTurn === true) {
        var section = parseInt($(this).data('section'), 10);
        that.flash(section);
        if (that.mode !== 'free') {
          that.userPlayed(section);
        }
      }
    });
    this.UPHandlerinitialised = true;
  },

  userPlayed: function (sID) {
    var that = this;
    if (this.sequence[this.userTurnLevel] == sID) {
      this.userTurnLevel++;
      if (this.userTurnLevel == this.gameLevel) {
        this.newLevel();
      }
    } else {
      if (this.mode == 'strict') {
        that.playerFailsStrict();
      } else if (this.mode == 'normal') {
        that.playerFailsNormal();
      }
    }
  },

  playerFailsStrict: function () {
    var that = this;
    $('p[data-action="lose"]').show();
    setTimeout(function () { that.startNewGame(); }, 3000);
  },

  playerWins: function () {
    var that = this;
    $('p[data-action="win"]').show();
    setTimeout(function () { that.startNewGame(); }, 3000);
  },

  playerFailsNormal: function () {
    var that = this;
    $('p[data-action="wrong"]').show();
    this.userTurnLevel = 0;
    setTimeout(function () { that.playbackCurrent(); }, 1500);
  },

  newLevel: function () {
    var that = this;
    this.gameLevel++;
    this.userTurnLevel = 0;
    if (this.gameLevel > this.sequence.length) {
      that.playerWins();
    } else {
      $('[data-level]').text(this.gameLevel);
      var $section = $('level').addClass('highlight-text');
      window.setTimeout(function () {
        $section.removeClass('highlight-text');
      }, 500);
      setTimeout(function () { that.playbackCurrent(); }, 1000);
    }
  },

  playbackCurrent: function () {
    var that = this;
    $('p[data-action="wrong"]').hide();
    this.usersTurn = false; //stop the user from inputting anything while we are playing back
    $.each(this.sequence, function (index, val) {
      if (that.gameLevel - 1 >= index) {         //only flash items up to and including the current level
        setTimeout(function () {
          that.flash(val);
        }, 1000 * index);
      }
    });
    setTimeout(function () { that.usersTurn = true; }, 1000 * this.gameLevel); //allow the user to input again after waiting for the playback to complete
  },

  clearTimeouts: function () {
    var id = window.setTimeout(function () { }, 0); //generate a new timeout to get the current ID
    while (id--) { //loop through any existing timeouts stopping them as we go
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
  }
};


$(document).ready(function () {
  game.init();
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}