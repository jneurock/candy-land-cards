const CARD_SINGLE_COLOR_COUNT = 4;
const CARD_DOUBLE_COLOR_COUNT = 3;
const CURRENT_CARD_SELECTOR = '.current-card';
const DOUBLE_MODIFIER = 'double';
const DECK_STACK_SELECTOR = '.deck-take';
const SHUFFLE_BUTTON_SELECTOR = '.shuffle';

const COLORS = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow',
];

const FACES = [
  'cone',
  'lollipop',
  'peanut',
  'peppermint',
];

const DECK_SOURCE = [];

let currentDeck;
let previousDeck;

(function buildDeckSource() {
  DECK_SOURCE.push(...FACES);

  COLORS.forEach(function(color) {
    for (let i = 0; i < CARD_SINGLE_COLOR_COUNT; i++) {
      DECK_SOURCE.push(`${color}`);
  
      if (i < CARD_DOUBLE_COLOR_COUNT) {
        DECK_SOURCE.push(`${color} ${DOUBLE_MODIFIER}`);
      }
    }
  });
})();

function compareDecks(deckA, deckB) {
  return JSON.stringify(deckA) === JSON.stringify(deckB);
}

function createDeck() {
  let deck = [...DECK_SOURCE];

  return shuffle(deck);
}

function disableDeck() {
  document.querySelector(DECK_STACK_SELECTOR).setAttribute('disabled', true);
}

function enableDeck() {
  document.querySelector(DECK_STACK_SELECTOR).removeAttribute('disabled');
}

function initGame() {
  currentDeck = createDeck();
  
  if (previousDeck) {
    if (compareDecks(currentDeck, previousDeck)) {
      return initGame();
    } else {
      previousDeck = currentDeck;
    }
  }

  resetCard();
  enableDeck();
}

function resetCard() {  
  let currentCardElement = document.querySelector(CURRENT_CARD_SELECTOR);

  currentCardElement.innerHTML = '';
}

function setUpDeckClick() {
  let cardStack = document.querySelector(DECK_STACK_SELECTOR);

  cardStack.addEventListener('click', function(e) {
    e.preventDefault();
    takeCard();
  });
}

function setUpShuffleClick() {
  let cardStack = document.querySelector(SHUFFLE_BUTTON_SELECTOR);

  cardStack.addEventListener('click', function(e) {
    e.preventDefault();
    initGame();
  });
}

function shuffle(deck) {
  return deck.sort(sortRandom);
}

function sortRandom() {
  let a = Math.floor(Math.random() * 100);
  let b = Math.floor(Math.random() * 100);

  return a < b ? 1 : a > b ? -1 : 0;
}

function takeCard() {
  let card = currentDeck.pop();
  let [kind, modifier] = card.split(' ');
  let currentCardElement = document.querySelector(CURRENT_CARD_SELECTOR);
  let cardImage = `<div class="card__image card__image--${kind}"></div>`;

  if (modifier === DOUBLE_MODIFIER) {
    cardImage = `${cardImage}\n${cardImage}`;
  }

  currentCardElement.innerHTML = `<div class="card">${cardImage}</div>`;

  if (currentDeck.length === 0) {
    disableDeck();
  }
}

(function main() {
  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      initGame();
      setUpDeckClick();
      setUpShuffleClick();
    }
  });
})();
