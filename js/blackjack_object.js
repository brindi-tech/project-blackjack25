// Blackjack object

/**
 * Class that represents the Blackjack game.
 */
class Card {
    constructor(suit, value) {
        this.suit = suit;   // 0–3
        this.value = value; // 1–13
    }
}

class Blackjack {
    // Constant that defines the maximum points to avoid busting in Blackjack
    static MAX_POINTS = 25;
    // Constant that defines the point threshold at which the dealer must stand
    static DEALER_MAX_TURN_POINTS = 21;

    /**
     * Creates an instance of Blackjack and initializes the deck.
     */
    constructor() {
        this.dealerCards = []; // Array to hold the dealer's cards
        this.playerCards = []; // Array to hold the player's cards
        this.dealerTurn = false; // Flag to indicate if it's the dealer's turn to play

        // State of the game with information about the outcome
        this.state = {
            gameEnded: false, // Indicates whether the game has ended
            playerWon: false, // Indicates if the player has won
            dealerWon: false, // Indicates if the dealer has won
            playerBusted: false, // Indicates if the player has exceeded MAX_POINTS
            dealerBusted: false // Indicates if the dealer has exceeded MAX_POINTS
        };

        // Initialize the deck of cards
        this.deck = this.shuffle(this.newDeck()); // Create and shuffle a new deck
    }

    //TODO: Implement this method
    /**
     * Creates a new deck of cards.
     * @returns {Card[]} - An array of cards.
     */
    

    newDeck() {
        const deck = [];
        const suits = [0, 1, 2, 3]; // 4 naipes

        for (let s of suits) {
            for (let v = 1; v <= 13; v++) {
                deck.push(new Card(s, v));
            }
        }
        return deck;
    }




    //TODO: Implement this method
    /**
     * Shuffles the deck of cards.
     * @param {Card[]} deck - The deck of cards to be shuffled.
     * @returns {Card[]} - The shuffled deck.
     */
    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }


    /**
     * Returns the dealer's cards.
     * @returns {Card[]} - An array containing the dealer's cards.
     */
    getDealerCards() {
        return this.dealerCards.slice(); // Return a copy of the dealer's cards
    }

    /**
     * Returns the player's cards.
     * @returns {Card[]} - An array containing the player's cards.
     */
    getPlayerCards() {
        return this.playerCards.slice(); // Return a copy of the player's cards
    }

    /**
     * Sets whether it is the dealer's turn to play.
     * @param {boolean} val - Value indicating if it's the dealer's turn.
     */
    setDealerTurn(val) {
        this.dealerTurn = val; // Update the dealer's turn status
    }

    //TODO: Implement this method
    /**
     * Calculates the total value of the provided cards.
     * @param {Card[]} cards - Array of cards to be evaluated.
     * @returns {number} - The total value of the cards.
     */
    getCardsValue(cards) {
        let total = 0;
        let aces = 0;

        for (let c of cards) {
            if (c.value === 1) {
                aces++;
                total += 1; 
            } else if (c.value >= 11 && c.value <= 13) {
                total += 10;
            } else {
                total += c.value;
            }
        }

        // tenta transformar Ás de 1 → 11
        while (aces > 0 && total + 10 <= Blackjack.MAX_POINTS) {
            total += 10;
            aces--;
        }

        return total;
    }
    


    //TODO: Implement this method
    /**
     * Executes the dealer's move by adding a card to the dealer's array.
     * @returns {Object} - The game state after the dealer's move.
     */


    dealerMove() {
        const card = this.deck.pop();   // tira carta do topo
        this.dealerCards.push(card);    // adiciona ao dealer
        return this.getGameState();
    }


    //TODO: Implement this method
    /**
     * Executes the player's move by adding a card to the player's array.
     * @returns {Object} - The game state after the player's move.
     */
    playerMove() {
        const card = this.deck.pop();   // tira carta do topo
        this.playerCards.push(card);    // adiciona ao jogador
        return this.getGameState();
    }


    //TODO: Implement this method
    /**
     * Checks the game state based on the dealer's and player's cards.
     * @returns {Object} - The updated game state.
     */
    getGameState() {
        const playerPoints = this.getCardsValue(this.playerCards);
        const dealerPoints = this.getCardsValue(this.dealerCards);

        // reset
        this.state.gameEnded = false;
        this.state.playerWon = false;
        this.state.dealerWon = false;
        this.state.playerBusted = false;
        this.state.dealerBusted = false;

        // 1) Jogador faz 25 → vitória imediata
        if (playerPoints === Blackjack.MAX_POINTS) {
            this.state.gameEnded = true;
            this.state.playerWon = true;
            return this.state;
        }

        // 2) Jogador rebenta
        if (playerPoints > Blackjack.MAX_POINTS) {
            this.state.gameEnded = true;
            this.state.playerBusted = true;
            this.state.dealerWon = true;
            return this.state;
        }

        // Se ainda é turno do jogador → não avaliar dealer
        if (!this.dealerTurn) {
            return this.state;
        }

        // 3) Dealer rebenta
        if (dealerPoints > Blackjack.MAX_POINTS) {
            this.state.gameEnded = true;
            this.state.dealerBusted = true;
            this.state.playerWon = true;
            return this.state;
        }

        // 4) Dealer atinge >= 21 → parar
        if (dealerPoints >= Blackjack.DEALER_MAX_TURN_POINTS) {

            this.state.gameEnded = true;

            if (dealerPoints > playerPoints) {
                this.state.dealerWon = true;
            } else if (dealerPoints < playerPoints) {
                this.state.playerWon = true;
            } else {
                // 5) Empate
                this.state.playerWon = false;
                this.state.dealerWon = false;
            }

            return this.state;
        }

        return this.state;
    }

    
}
