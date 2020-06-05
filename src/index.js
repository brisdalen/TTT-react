import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
Display the location for each move in the format (col, row) in the move history list.
Bold the currently selected item in the move list.
Rewrite Board to use two loops to make the squares instead of hardcoding them.
X Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
X When no one wins, display a message about the result being a draw.
*/

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
            <Square 
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
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

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares,
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
    
    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move :
        'Go to game start';

      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
       );
    });

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else if(this.state.stepNumber === 9) {
      status = 'It\'s a draw!'; 
    }else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

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
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => {
            this.state.descendingHistory = !this.state.descendingHistory;
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

