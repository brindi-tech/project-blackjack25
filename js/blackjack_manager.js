// Blackjack OOP

let game = null; // Stores the current instance of the game
let currentGameCounted = false;

/**
 * Function to debug and display the state of the game object.
 * @param {Object} obj - The object to be debugged.
 */
function debug(obj) {
    document.getElementById('debug').innerHTML = JSON.stringify(obj); // Displays the state of the object as JSON
}

/**
 * Initializes the game buttons.
 */
function buttonsInitialization() {
    document.getElementById('card').disabled = false; // Enables the button to draw a card
    document.getElementById('stand').disabled = false; // Enables the button to stand
    document.getElementById('new_game').disabled = true; // Disables the button for a new game
}

/**
 * Finalizes the buttons after the game ends.
 */
function finalizeButtons() {
    //TODO: Reveal the dealer's hidden card if you hid it like you were supposed to.

    document.getElementById('card').disabled = true; // Disables the button to draw a card
    document.getElementById('stand').disabled = true; // Disables the button to stand
    document.getElementById('new_game').disabled = false; // Enables the button for a new game
}

//TODO: Implement this method.
/**
 * Clears the page to start a new game.
 */
function clearPage() {
    document.getElementById('dealer').innerHTML = "";
    document.getElementById('player').innerHTML = "";
    document.getElementById('game_status').innerHTML = "";
    document.getElementById('dealer_total').textContent = "0";
    document.getElementById('player_total').textContent = "0";
}


//TODO: Complete this method.
/**
 * Starts a new game of Blackjack.
 */
function newGame() {
    clearPage();

    game = new Blackjack();
    currentGameCounted = false;
    buttonsInitialization();
    debug(game);

    // 2 cartas dealer, 2 cartas player (regra do enunciado: dealer 2, player 1 mínimo)
    let state;

    // primeira carta dealer (visível)
    state = game.dealerMove();
    // segunda carta dealer (oculta na interface)
    state = game.dealerMove();

    // uma carta para o player
    state = game.playerMove();
    state = game.playerMove();
    updateDealer(state);
    updatePlayer(state);
}


//TODO: Implement this method.
/**
 * Calculates and displays the final score of the game.
 * @param {Object} state - The current state of the game.
 */
function finalScore(state) {
    const dealerPoints = game.getCardsValue(game.getDealerCards());
    const playerPoints = game.getCardsValue(game.getPlayerCards());

    let msg = `Dealer: ${dealerPoints} | Player: ${playerPoints} — `;

    if (state.playerWon && !state.dealerWon) {
        msg += "Player wins!";
    } else if (state.dealerWon && !state.playerWon) {
        msg += "Dealer wins!";
    } else if (!state.playerWon && !state.dealerWon && state.gameEnded) {
        msg += "Draw!";
    } else {
        msg += "Game in progress.";
    }

    document.getElementById('game_status').innerHTML = msg;
    if (!currentGameCounted) {
        updateStats(state);
        currentGameCounted = true;
    }
}


//TODO: Implement this method.
/**
 * Updates the dealer's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updateDealer(state) {
    const dealerElem = document.getElementById('dealer');
    dealerElem.innerHTML = "";

    const cards = game.getDealerCards();
    const BACK_CARD = "img/png/red_joker.png";
    // primeira carta sempre visível
    printCard(dealerElem, cards[0]);

    // segunda carta escondida enquanto o jogo não acabou
    if (cards.length > 1) {
        if (!state.gameEnded) {
            const img = document.createElement("img");
            img.src = BACK_CARD; // carta virada
            img.classList.add("carta");
            dealerElem.appendChild(img);
            const visibleCards = cards.filter((_, index) => index !== 1);
            document.getElementById('dealer_total').textContent =
                `${game.getCardsValue(visibleCards)} + ?`;
        } else {
            printCard(dealerElem, cards[1]);
            document.getElementById('dealer_total').textContent =
                game.getCardsValue(cards);
        }
    } else {
        document.getElementById('dealer_total').textContent =
            game.getCardsValue(cards);
    }

    // restantes cartas (se houver)
    for (let i = 2; i < cards.length; i++) {
        printCard(dealerElem, cards[i]);
    }

    if (state.gameEnded) {
        finalizeButtons();
        finalScore(state);
    }
}



//TODO: Implement this method.
/**
 * Updates the player's state in the game.
 * @param {Object} state - The current state of the game.
 */
function updatePlayer(state) {
    const playerElem = document.getElementById('player');
    playerElem.innerHTML = "";

    const cards = game.getPlayerCards();

    for (let c of cards) {
        printCard(playerElem, c);
    }
    document.getElementById('player_total').textContent =
        game.getCardsValue(cards);

    if (state.gameEnded) {
        finalizeButtons();
        finalScore(state);
    }
}



//TODO: Implement this method.
/**
 * Causes the dealer to draw a new card.
 * @returns {Object} - The game state after the dealer's move.
 */
function dealerNewCard() {
    const state = game.dealerMove();
    updateDealer(state);
    debug(game);
    return state;
}


//TODO: Implement this method.
/**
 * Causes the player to draw a new card.
 * @returns {Object} - The game state after the player's move.
 */
function playerNewCard() {
    const state = game.playerMove();
    updatePlayer(state);
    debug(game);
    return state;
}


//TODO: Implement this method.
/**
 * Finishes the dealer's turn.
 */
function dealerFinish() {
    game.setDealerTurn(true);

    let state = game.getGameState();
    while (!state.gameEnded) {
        state = dealerNewCard();
    }
}
let stats = {
    wins: 0,
    losses: 0,
    draws: 0,
    total: 0
};

function updateStats(state) {
    stats.total++;

    if (state.playerWon) {
        stats.wins++;
    } else if (state.dealerWon) {
        stats.losses++;
    } else {
        stats.draws++;
    }

    document.getElementById("wins").textContent = stats.wins;
    document.getElementById("losses").textContent = stats.losses;
    document.getElementById("draws").textContent = stats.draws;
    document.getElementById("total").textContent = stats.total;
}



//TODO: Implement this method.
/**
 * Prints the card in the graphical interface.
 * @param {HTMLElement} element - The element where the card will be displayed.
 * @param {Card} card - The card to be displayed.
 * @param {boolean} [replace=false] - Indicates whether to replace the existing image.
 */
const SUIT_NAME = {
    0: "clubs",
    1: "diamonds",
    2: "hearts",
    3: "spades"
};
const CARD_NAME = {
    1: "ace",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "jack",
    12: "queen",
    13: "king"
};


function printCard(element, card, replace = false) {
    const suitName = SUIT_NAME[card.suit];
    const cardName = CARD_NAME[card.value];   // converte número → nome
    const img = document.createElement("img");

    img.src = `img/png/${cardName}_of_${suitName}.png`;
    img.classList.add("carta");

    if (replace) {
        element.innerHTML = "";
    }

    element.appendChild(img);
}
