const ANIMATION_DELAY = 10;
const CARD_SINGLE_COLOR_COUNT = 4;
const CARD_DOUBLE_COLOR_COUNT = 3;
const CARD_SELECTOR = '.card';
const CURRENT_CARD_SELECTOR = '.current-card';
const DOUBLE_DESCRIPTION = 'double';
const DECK_STACK_SELECTOR = '.deck-take';
const FADE_DURATION = 125;
const SHUFFLE_BUTTON_SELECTOR = '.shuffle';
const SINGLE_DESCRIPTION = 'single';

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

let currentCardElement;
let currentDeck;
let previousDeck;

(function buildDeckSource() {
  DECK_SOURCE.push(...FACES);

  COLORS.forEach(function(color) {
    for (let i = 0; i < CARD_SINGLE_COLOR_COUNT; i++) {
      DECK_SOURCE.push(`${color} ${SINGLE_DESCRIPTION}`);
  
      if (i < CARD_DOUBLE_COLOR_COUNT) {
        DECK_SOURCE.push(`${color} ${DOUBLE_DESCRIPTION}`);
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

function fadeCard({ opacity }) {
  let cardElement = currentCardElement.querySelector(CARD_SELECTOR);

  if (!cardElement) return;

  return new Promise(function(resolve) {
    setTimeout(function() {
      cardElement.style.opacity = opacity;
    }, ANIMATION_DELAY);

    setTimeout(resolve, FADE_DURATION);
  });
}

function initGame() {
  currentCardElement = document.querySelector(CURRENT_CARD_SELECTOR);
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

async function renderCard(card) {
  let [kind, description] = card.split(' ');
  let cardImage = `<div class="card__image"></div>`;
  let modifierClasses = `card--${kind}`;

  if (description === DOUBLE_DESCRIPTION) {
    cardImage = `${cardImage}\n${cardImage}`;
  }

  if (!description) {
    modifierClasses += ' card--face';
  }

  await fadeCard({ opacity: 0 });

  currentCardElement.innerHTML = `<div class="card ${modifierClasses}">${cardImage}</div>`;

  await fadeCard({ opacity: 1 });
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

async function takeCard() {
  let card = currentDeck.pop();

  disableDeck();

  await renderCard(card);

  if (currentDeck.length > 0) {
    enableDeck();
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
