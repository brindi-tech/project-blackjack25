class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }
}

class Blackjack {
    static MAX_POINTS = 25;
    static DEALER_MAX_TURN_POINTS = 21;

    constructor(version = Blackjack.MAX_POINTS) {
        if (version !== 21 && version !== Blackjack.MAX_POINTS) {
            throw new RangeError("A versão deve ser Blackjack 21 ou Blackjack 25.");
        }

        this.maxPoints = version;
        this.dealerMaxTurnPoints = version === 21 ? 17 : Blackjack.DEALER_MAX_TURN_POINTS;
        this.dealerCards = [];
        this.playerCards = [];
        this.dealerTurn = false;
        this.state = {
            gameEnded: false,
            playerWon: false,
            dealerWon: false,
            playerBusted: false,
            dealerBusted: false,
            naturalBlackjack: false
        };

        this.deck = this.shuffle(this.newDeck());
    }

    newDeck() {
        const deck = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let value = 1; value <= 13; value++) {
                deck.push(new Card(suit, value));
            }
        }
        return deck;
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    getDealerCards() {
        return this.dealerCards.slice();
    }

    getPlayerCards() {
        return this.playerCards.slice();
    }

    setDealerTurn(val) {
        this.dealerTurn = val;
    }

    getCardsValue(cards) {
        let total = 0;
        let aces = 0;

        for (const c of cards) {
            if (c.value === 1) {
                aces++;
                total += 1; 
            } else if (c.value >= 11 && c.value <= 13) {
                total += 10;
            } else {
                total += c.value;
            }
        }

        while (aces > 0 && total + 10 <= this.maxPoints) {
            total += 10;
            aces--;
        }

        return total;
    }
    
    dealerMove() {
        const card = this.deck.pop();
        this.dealerCards.push(card);
        return this.getGameState();
    }

    playerMove() {
        const card = this.deck.pop();
        this.playerCards.push(card);
        return this.getGameState();
    }

    getGameState() {
        const playerPoints = this.getCardsValue(this.playerCards);
        const dealerPoints = this.getCardsValue(this.dealerCards);

        this.state.gameEnded = false;
        this.state.playerWon = false;
        this.state.dealerWon = false;
        this.state.playerBusted = false;
        this.state.dealerBusted = false;
        this.state.naturalBlackjack = false;

        if (playerPoints === this.maxPoints) {
            this.state.gameEnded = true;
            this.state.playerWon = true;
            this.state.naturalBlackjack =
                this.maxPoints === 21 && this.playerCards.length === 2;
            return this.state;
        }

        if (playerPoints > this.maxPoints) {
            this.state.gameEnded = true;
            this.state.playerBusted = true;
            this.state.dealerWon = true;
            return this.state;
        }

        if (!this.dealerTurn) {
            return this.state;
        }

        if (dealerPoints > this.maxPoints) {
            this.state.gameEnded = true;
            this.state.dealerBusted = true;
            this.state.playerWon = true;
            return this.state;
        }

        if (dealerPoints >= this.dealerMaxTurnPoints) {

            this.state.gameEnded = true;

            if (dealerPoints > playerPoints) {
                this.state.dealerWon = true;
            } else if (dealerPoints < playerPoints) {
                this.state.playerWon = true;
            } else {
                this.state.playerWon = false;
                this.state.dealerWon = false;
            }

            return this.state;
        }

        return this.state;
    }

    
}
