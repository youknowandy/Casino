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
  this.cards = [];
  this.value = 0;
  this.num11Aces = 0;
  this.hiddenCard = false;

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


const dealerCards = new Hand("dealer-hand", "dealer-total");
const playerCards = new Hand("player-hand", "player-total");

dealButton.addEventListener("click", function () {
  dealButton.disabled = true;
  dealerCards.reset();
  playerCards.reset();
  dealerCards.deal();
  setTimeout(function () {
    dealerCards.deal(true);
  }, 500);
  setTimeout(function () {
    playerCards.deal();
  }, 1000);
  setTimeout(function () {
    playerCards.deal();
    hitButton.disabled = false;
    standButton.disabled = false;
    doubledownButton.disabled = false;
  }, 1500);

});

hitButton.addEventListener("click", function () {
  playerCards.deal();
  doubledownButton.disabled = true;
  if (playerCards.value > 21) {
    dealButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
	doubledownButton.disabled = true;
    dealerCards.revealSecondCard();
  }
});

standButton.addEventListener("click", function () {
    hitButton.disabled = true;
    standButton.disabled = true;
	doubledownButton.disabled = true;
    dealerCards.revealSecondCard();

    function iteration() {
      if (dealerCards.value < 17) {
        dealerCards.deal();
        setTimeout(iteration, 500);
      } else {
        dealButton.disabled = false;
      }
    }
    setTimeout(iteration, 1000);
});

doubledownButton.addEventListener("click", function () {
  hitButton.disabled = true;
  standButton.disabled = true;
  doubledownButton.disabled = true;

  playerCards.deal();
  setTimeout(function () {
    dealerCards.revealSecondCard();
    dealButton.disabled = false;	
  }, 500);  
  


});

