var game = {
  sequence: [], //the full sequence of flashes
  currentLevel: 0,  //the level the user is up too 
  gameOver: 0,
  usersTurn: false, //whether it is the users turn or not (only count presses if it is there turn)
  userTurnLevel:  0,  //the position in the sequence the user is currently guessing
  UPHandlerinitialised: false, // whether the press section handler is initialised

  init: function () {
    if(this.UPHandlerinitialised === false){		//checks to see if handlers are already active
			this.initUserPressHandler();		//if not activate them
		}
    this.startNewGame();
    this.playbackCurrent();
  },

  startNewGame: function () {
    for (var i = 0; i < 20; i++) {
      this.sequence[i] = getRandomInt(0, 3);
    }
    this.currentLevel = 1;
    this.gameOver = 0;
  },

  flash: function (sID) {
    //that.playSound(pad);
    console.log("flashing " + sID);
    $("#section" + sID).stop().animate({
      opacity: '1'
    }, {
        duration: 400,
        complete: function () {
          $("#section" + sID).stop().animate({
            opacity: '.5'
          }, 500);
        }
      });
  },

  initUserPressHandler: function(){
		var that=this;
    console.log("setting up handler");
		$('.section').on('mouseup',function(){
			if(that.usersTurn===true){
				var section=parseInt($(this).data('section'),10);	
				that.flash(section);
        that.userPlayed(section);
			}
		});
    console.log("handler done");
		this.UPHandlerinitialised = true;
	},

  userPlayed: function(sID){
    if(this.sequence[this.userTurnLevel] == sID){
        this.userTurnLevel++;
        if(this.userTurnLevel == this.currentLevel){
            this.currentLevel++;
            this.playbackCurrent();
        }         
    } else {

    }
  },

  playbackCurrent: function () {
    var that = this;
    console.log(this.sequence);
    $.each(this.sequence, function (index, val) {		//iterate over each value in the generated array
      if (that.currentLevel-1 >= index) {         //only flash items up to and including the current level
        setTimeout(function () {
          that.flash(val);
        }, 1000 * index);				// multiply timeout by how many items in the array so that they play sequentially
      }
    });
    this.usersTurn=true;
  }
};


$(document).ready(function () {
  game.init();
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}