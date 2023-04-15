var dealButton = document.getElementById("deal-button");
var hitButton = document.getElementById("hit-button");
var standButton = document.getElementById("stand-button");
var doubledownButton = document.getElementById("doubledown-button");

function Card(hidden = false) {
  const faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suits = ["&hearts;", "&diams;", "&clubs;", "&spades;"];
  this.face = faces[Math.floor(Math.random() * faces.length)];
  this.suit = suits[Math.floor(Math.random() * suits.length)];
  this.hidden = hidden

  this.toString = function () {
    if (this.hidden) {
      return "??";
    } else {
      return this.face + this.suit;
    }
  }

  this.value = function() {
    if (this.face === "A") {
      return 11;
    } else if (parseInt(this.face)) {
      return parseInt(this.face);
    } else {
      return 10;
    }
  }
}

function Hand(cardDisplayID, valueDisplayID) {
  this.cardDisplay = document.getElementById(cardDisplayID);
  this.valueDisplay = document.getElementById(valueDisplayID);
  this.cards = []; // a string representing the cards in a hand in the form of "xS xS... xS"
  this.value = 0; // the current value of this hand
  this.num11Aces = 0; // the number of aces in this hand
  this.hiddenCard = false; // true if the second card is hidden (applies to dealer only)

  this.deal = function (hidden = false) {
    const card = new Card(hidden);
    this.cards.push(card);
    this.value += card.value();
    if (hidden) {
      this.hiddenCard = true;
    }
    if (card.face === "A") {
      this.num11Aces++;
    }

    if (this.num11Aces > 0 && this.value > 21) {
      this.num11Aces--;
      this.value -= 10;
    }    

    this.refreshDisplay();
  };

  this.toString = function () {
    let str = "";
    for (let i = 0; i < this.cards.length; i++) {
      str += this.cards[i].toString() + " ";
    }
    return str.trim();
  };

  this.refreshDisplay = function () {
    this.cardDisplay.innerHTML = this.toString();
    this.valueDisplay.innerHTML = this.hiddenCard ? "?" : this.value;
  }

  this.reset = function () {
    this.cards = [];
    this.value = 0;
    this.num11Aces = 0;
    this.refreshDisplay();
  }

  this.revealSecondCard = function () {
    this.cards[1].hidden = false;
    this.hiddenCard = false;
    this.refreshDisplay();
  }

}

function Player() {
  this.score = 0;
  this.doubledowned = false;
  this.scoreDisplay = document.getElementById("player-score");
  this.hand = new Hand("player-hand", "player-total");
  
  this.new_game = function() {
    this.doubledowned = false;
	this.hand.reset();
  }
  
  this.resolve_round = function() {
	playertotal = this.hand.value;
	dealertotal = dealer.hand.value;
	winnings = 0;
	
	if (playertotal > 21 || (dealertotal > playertotal && dealertotal <= 21 )) {
	  // Player loses if they bust of if they got less than the dealer and the dealer didn't bust
	  winnings = -1;
	} else if (playertotal > dealertotal || dealertotal > 21) {
	  // Player wins if they got more than the dealer or the dealer busts
	  // Players wins 50% more if they got a Black Jack
	  winnings = (playertotal == 21 && this.hand.cards.length == 2) ? 1.5 : 1;
	}
	
	// Players win or loss doubles if they double downed
	if (this.doubledowned) {
	  winnings *= 2;
	}
	
	// Add the winnings to the total score and update the display
	this.score += winnings;
	this.scoreDisplay.innerHTML = this.score;
	console.log("dealer total = " + dealertotal + "; player total = " + playertotal + "; winnings = " + winnings + "; double downed = " + this.doubledowned)
  };

}

function Dealer() {
  this.hand = new Hand("dealer-hand", "dealer-total");

  this.resolve_round = function() {
    dealer.hand.revealSecondCard();

    function iteration() {
      if (dealer.hand.value < 17) {
        dealer.hand.deal();
        setTimeout(iteration, 500);
      } else {
        player1.resolve_round()
        dealButton.disabled = false;
      }
    }
    setTimeout(iteration, 1000);
  }
	
  this.disable_all_buttons = function () {
	dealButton.disabled = true;
	hitButton.disabled = true;
    standButton.disabled = true;
    doubledownButton.disabled = true; 
  }
}

const player1 = new Player();
const dealer = new Dealer();

dealButton.addEventListener("click", function () {
  dealer.disable_all_buttons();
  dealer.hand.reset();
  player1.new_game();
  
  // Deal the dealer and players two cards each (2nd dealer card face down)
  dealer.hand.deal();
  setTimeout(function () {
    dealer.hand.deal(true);
  }, 500);
  setTimeout(function () {
    player1.hand.deal();
  }, 1000);
  setTimeout(function () {
    player1.hand.deal();
	
	// Enable all other buttons
    hitButton.disabled = false;
    standButton.disabled = false;
    doubledownButton.disabled = false;
  }, 1500);

});

hitButton.addEventListener("click", function () {
  dealer.disable_all_buttons();
  player1.hand.deal();
  function resolve_round() {
	dealer.resolve_round()
  }
  if (player1.hand.value > 21) {
    setTimeout(resolve_round, 500);
  } else {
	hitButton.disabled = false;
	standButton.disabled = false;
  }
});

standButton.addEventListener("click", function () {
  dealer.disable_all_buttons();
  dealer.resolve_round();	
});

doubledownButton.addEventListener("click", function () {
  dealer.disable_all_buttons();
  player1.doubledowned = true;
  player1.hand.deal();
  dealer.resolve_round();
});
