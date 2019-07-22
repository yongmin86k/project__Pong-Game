import Init from "./Init";
import Board from "./Board";
import Net from "./Net";
import Paddle from "./Paddle";
import Ball from "./Ball";
import Score from "./Score";
import SingleMode from "./SingleMode";
import Winner from "./Winner";
import { SVG_NS, KEYS, PaddleOptions, BallOptions } from "../settings";

export default class Game {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;

    // SVG container
    this.gameElement = document.getElementById(this.element);
    
    // initiate the first screen of game
    this.initPlayer1 = new Init(
      (this.width / 2) - 100, 
      (this.height / 2) + 8, 
      '> Single',
    );
    this.initPlayer2 = new Init(
      (this.width / 2) + 100, 
      (this.height / 2) + 8, 
      '> Multi',
    );
    this.caption = new Init(
      this.width / 2,
      this.height - 20,
      'Press <- or -> to select the mode and hit <Enter>',
      12
    );

    // create the board and net with same size of the SVG container
    this.board = new Board(this.width, this.height);
    this.net = new Net(this.width, this.height);

    // create single-play mode notice
    this.singlePlay = new SingleMode(this.width, this.height);

    // create new paddles for the each players
    this.player1 = new Paddle(
      this.height,
      PaddleOptions.paddleWidth,
      PaddleOptions.paddleHeight,
      PaddleOptions.boardGap,
      ((this.height - PaddleOptions.paddleHeight) / 2),
      PaddleOptions.player1Color,
      KEYS.a,
      KEYS.z,
    );
    this.player2 = new Paddle(
      this.height,
      PaddleOptions.paddleWidth,
      PaddleOptions.paddleHeight,
      this.width - (PaddleOptions.paddleWidth + PaddleOptions.boardGap),
      ((this.height - PaddleOptions.paddleHeight) / 2),
      PaddleOptions.player2Color,
      KEYS.up,
      KEYS.down,
    );

    // create scores for players
    this.score1 = new Score(this.width / 2 - 40, 40, 32);
    this.score2 = new Score(this.width / 2 + 40, 40, 32);

    // create a new ball for the game
    this.ball = {};
    for (let i = 0; i < BallOptions.number; i++){
      this.ball[`new_${i}`] = new Ball(
        [i], // nth of the  ball
        this.width, // width of the Board
        this.height, // width of the Board
        BallOptions.ballSize[i], // size of each balls in settings.js (Default: 8)
        BallOptions.ballColor[i] // color of each balls in settings.js (Default: white)
        );
    }

    // switch between first screen and game screen
    this.showFirstScreen = true;

    // keys of switches which affect gameplay
    document.addEventListener('keydown', event => {
      switch(event.key){
        case KEYS.right:
          if ( this.showFirstScreen === true ){
            this.isMulti = !this.isMulti;
          }
          break;
        case KEYS.left:
          if ( this.showFirstScreen === true ){
            this.isMulti = !this.isMulti;
          }
          break;
        case KEYS.spaceBar:
          this.pause = !this.pause;
          break;
        case KEYS.enter:
          this.startPlay =!this.startPlay;
          this.showFirstScreen = true; // return to the first screen
          break;
      }
    });

    // new Object and instance for the winner
    this.winner;
    this.displayWinner = new Winner(this.width);

  } /* 
    // end of constructor
    */
  
  render() {
    // if pause === true, render stop
    if ( this.pause ) { return }
    
    // hide the first screen when game begins
    if ( this.startPlay === true ){ 
      this.showFirstScreen = false;
    }
    
    // properties for SVG tag
    this.gameElement.innerHTML = ''; // Clear the html before appending to fix a render bug 👾
    let svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);
    svg.setAttributeNS(null, "viewBox", [0, 0, this.width, this.height]);
    this.gameElement.appendChild(svg);

    // Render the board
    this.board.render(svg);

    // Render first screen contents
    if (this.showFirstScreen === true){
      this.initPlayer1.render(svg, !this.isMulti);
      this.initPlayer2.render(svg, this.isMulti);
      this.caption.render(svg);
    }

    // Assign who is the winner
    this.winner = this.displayWinner.winnerIs(this.player1.score, this.player2.score);

    // Display the winner of the game
    if ( this.winner ) {
      this.displayWinner.render(svg, this.winner);
      return
    }

    // Render game contents
    if ( this.startPlay === true ){

      if ( !this.isMulti ){
        // Play single-player mode
        this.singlePlay.render(svg);
      } else {
        // Play muti-players mode
        this.multiPlay(svg);
      }
      
    }

  } // end of render()

  multiPlay(svg){
    // Render the net
    this.net.render(svg);

    // Render the paddles
    this.player1.render(svg);
    this.player2.render(svg);

    // Render the ball
    for (let i = 0; i < BallOptions.number; i++){
      this.ball[`new_${i}`].render(svg, this.player1, this.player2);
    }
    
    // Update scores
    this.score1.render(svg, this.player1.score);
    this.score2.render(svg, this.player2.score);

    // return to the first page
    document.addEventListener('keypress', event => {
      switch(event.key){
        case KEYS.enter:
          // reset the winner
            this.winner = undefined;
          // reset positions of balls
          for (let i = 0; i < BallOptions.number; i++){
            this.ball[`new_${i}`].x = 0;
            this.ball[`new_${i}`].y = 0;
          }    
          // reset the paddle position
          this.player1.x = PaddleOptions.boardGap;
          this.player1.y = ((this.height - PaddleOptions.paddleHeight) / 2);
          this.player2.x = this.width - (PaddleOptions.paddleWidth + PaddleOptions.boardGap);
          this.player2.y = ((this.height - PaddleOptions.paddleHeight) / 2);
          // reset the scores
          this.player1.score = 0;
          this.player2.score = -1; 
          /* 
            I absolutely have no idea when I set player2's score with value 0, it returns with 1.
            So, I set -1 to make it 0
          */
        break;
      }
    });

  } // end of multiPlay()
}