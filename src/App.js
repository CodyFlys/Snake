import React, { Component, useState } from 'react';
import Snake from './Components/Snake';
import Food from './Components/Food';


let start = new Boolean(false);

const getRandomCoordinates = () => {
  let min = 1;
  let max = 96;
  let x = Math.floor((Math.random()*(max-min+1)+min)/4)*4;
  let y = Math.floor((Math.random()*(max-min+1)+min)/4)*4;
  return[x,y]
}

const initialState = {
  score: 3,
  food: getRandomCoordinates(),
  speed: 250,
  direction: 'RIGHT',
  snakeDots: [
    [0,0],
    [4,0],
    [8,0]
  ]
}

class App extends Component {
  constructor(props) {
    super();
    this.state = initialState;
    this.Restart = this.Restart.bind(this);
    this.endGame = this.endGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.menu = this.menu.bind(this);
  }

  componentDidMount() {
    if(start == true){
      this.startGame();
    } else if (start == false){
      this.menu();
    }
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
    this.speed();
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      // WASD
      case 87:
        this.setState({direction: 'UP'});
        break;
      case 83:
        this.setState({direction: 'DOWN'});
        break;
      case 65:
        this.setState({direction: 'LEFT'});
        break;
      case 68:
        this.setState({direction: 'RIGHT'});
        break;

      // ARROW KEYS
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }
  moveSnake = () => {
    let moving = new Boolean(true);
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length -1]; // our head

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 4, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 4, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 4];
        break;
      case 'UP':
        head = [head[0], head[1] - 4];
        break;
    }
    dots.push(head); // adding head
    dots.shift(); // removing tail
    this.setState({
      snakeDots: dots
    })
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1]; // find our head
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length -1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length -1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      let newState = { ...this.state };
      newState.score += 1;
      newState.food = getRandomCoordinates();
      newState.speed = this.increaseSpeed();
      this.setState(newState);
      this.speed();
      this.enlargeSnake();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  speed() {
    clearInterval(this.interval);
    this.interval = setInterval(this.moveSnake, this.state.speed);
  }

  increaseSpeed() {
    if (this.state.speed > 50) {
      return this.state.speed - 5;
    }
  }

  startGame() {
    start = !start;
    document.onkeydown = this.onKeyDown;
    setInterval(this.moveSnake, this.state.speed);
    let y = document.getElementById('game-start')
    y.style.display = 'none';
    let s = document.getElementById('score')
    s.style.display = 'block';
    this.setState(initialState)
  }

  menu() {
    document.onkeyup = null;
    let y = document.getElementById('game-start')
    let s = document.getElementById('score')
    s.style.display = 'none';
    y.style.display = 'block';
  }

  onGameOver() {
    let x = document.getElementById("game-over");
    let z = document.getElementById("replay");
    x.style.display = "block";
    this.endGame();
  }

  Restart() {
    document.onkeydown = this.onKeyDown;
    this.setState(initialState);
    let x = document.getElementById("game-over");
    x.style.display = "none";
  }

  endGame() {
    document.onkeydown = null
    this.setState({
      score: this.state.score,
      speed: 0,
      direction: 'LEFT',
      snakeDots: [
        [0,0],
        [4,0],
        [8,0]
      ]
    })
  }

  render(){
    return (
      <div className="wrapper">

        <div id="rules">
        <h1> - RULES -</h1>
        <h3> - Eat the red dots.</h3>
        <h3> - Don't eat your self!</h3>
        <h3 className="sub-title"> BY<br/> CODY SOLOMON</h3>

        </div>

        <div className="game-container">
          <h1 className="title">SNAKE</h1>
          <div className="game-area">

          <div id="game-start">
              <button id="play" onClick={this.startGame}>PLAY</button>
            </div>

            <div id="game-over">
              <h1>GAME OVER</h1>
              <button id="replay" onClick={this.Restart}>REPLAY</button>
            </div>


            <h1 id="score">SCORE: {this.state.score}</h1>
            <Snake snakeDots={this.state.snakeDots}/>
            <Food dot={this.state.food}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;