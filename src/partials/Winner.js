import { SVG_NS, GameOptions } from "../settings";

// method to define who is the winner
export default class Winner {

    winnerIs(score1, score2){ 
        const player1_isWinner = score1 >= GameOptions.winningScore;
        const player2_isWinner = score2 >= GameOptions.winningScore;

        if ( player1_isWinner ){
            return this.winner = 'player 1';
        } else if ( player2_isWinner ){
            return this.winner = 'player 2';
        }
    }
}