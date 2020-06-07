import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
X Display the location for each move in the format (col, row) in the move history list.
Bold the currently selected item in the move list.
X Rewrite Board to use two loops to make the squares instead of hardcoding them.
X Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
X When no one wins, display a message about the result being a draw.
*/

function Square(props) {
  return (
    <button 
      className={"square " + (props.isWinning ? "square--winning" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
            <Square 
              isWinning = {this.props.winningSquares.includes(i)}
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
              // key={} is to give each child a unique key
              // Here 's' is for Square
              key={'s'+i}
            />
    );
  }

  render() {
    var rows = [];
    let counter = 0;
    for(let i = 0; i < 3; i++) {
      let columns = [];
      for(let s = 0; s < 3; s++) {
        columns.push(this.renderSquare(counter));
        counter++;
      }
      // key={} is to give each child a unique key
      // Here 'r' is for row
      rows.push(<div className="board-row" key={'r'+i}>{columns}</div>);
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        // The earlier selected moves must also be stored in the history
        moves: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      descendingHistory: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // Do nothing if there's a winner or the square is already filled
    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares,
        // Include the selected sqaure-index in the history's state
        moves: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    let winLine;
    if(winner) {
      status = 'Winner: ' + winner.player;
      winLine = winner.line;
    } else if(this.state.stepNumber === 9) {
      status = 'It\'s a draw!'; 
    }else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    const moves = history.map((step, move) => {
      const desc = move ? 
        // Retrieve the move from step, and calculate the col and row using this
        'Go to move #' + move + " (" + (step.moves % 3 + 1) + "," + (Math.floor(step.moves / 3) + 1) + ")" 
        : 'Go to game start';
      return (
        // key={} is to give each child a unique key
        // here I use the move as the unique key
        <li className="historyElement" key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move == this.state.stepNumber ? <b>{desc}</b> : desc}
            </button>
        </li>
       );
    });

    let orderedHistory;
    if(this.state.descendingHistory) {
      orderedHistory = moves.reverse();
    } else {
      orderedHistory = moves;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winningSquares = {winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => {
            // Using setState fixed my earlier problem of the rendering of
            // the history list not updating till the next move was performed
            this.setState ({
              descendingHistory: !this.state.descendingHistory,
            });
            orderedHistory.reverse();
          }}>Reverse move history order</button>
          <ol id="history_list">{orderedHistory}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {player: squares[a], line: [a, b, c]};
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

