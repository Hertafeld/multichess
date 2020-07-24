import React, { Component } from "react";
import PropTypes from "prop-types";
import Chessboard from "chessboardjsx";

import CloneButton from "./CloneButton"

class Subgame extends Component {
  static propTypes = { children: PropTypes.func };

  state = {
    // square styles for active drop square
    dropSquareStyle: {},
    // custom square styles
    squareStyles: {},
    // square with the currently clicked piece
    pieceSquare: "",
    // currently clicked square
    square: "",
    // Whether or not the clone setting is on
    shouldClone: false
  };

  handleMouseLeave = event => {
    this.setState({
      shouldClone: false
    });
  }

  squareStyling = ({ pieceSquare }) => {
    const history = this.props.game.history({ verbose: true });
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      })
    };
  };

  // keep clicked square style and remove hint squares
  removeHighlightSquare = () => {
    this.setState(({ pieceSquare }) => ({
      squareStyles: this.squareStyling({ pieceSquare})
    }));
  };

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          ...this.squareStyling({
            pieceSquare: this.state.pieceSquare
          })
        };
      },
      {}
    );

    this.setState(({ squareStyles }) => ({
      squareStyles: { ...squareStyles, ...highlightStyles }
    }));
  };


  onDrop = ({ sourceSquare, targetSquare }) => {
    this.tryMove(sourceSquare, targetSquare);
  };

  onSquareClick = square => {
    // Bail if it's not our turn
    if (this.props.game.turn() !== this.props.player) return;
    
    this.setState({
      squareStyles: this.squareStyling({ pieceSquare: square }),
      pieceSquare: square
    });

    this.tryMove(this.state.pieceSquare, square);
    
  };

  tryMove = (fromSquare, toSquare) => {

    // Bail if it's not our turn
    if (this.props.game.turn() !== this.props.player) return;

    // see if the move is legal
    let move = this.props.game.move({
      from: fromSquare,
      to: toSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.props.game.undo();

    if (this.state.shouldClone) {
      this.props.clone(this.props.index);
      this.setState({
        shouldClone: false
      });
    }

    this.props.update(this.props.index, move);
    this.checkWin();
    this.setState(({ pieceSquare }) => ({
      squareStyles: this.squareStyling({ pieceSquare})
    }));    
  };

  checkWin = () => {
    if (this.props.game.in_checkmate()) {
      if (this.props.game.turn() === 'w') {
        this.props.markWin(this.props.index, 'b');
      } else {
        this.props.markWin(this.props.index, 'w');
      }
    } else if (this.props.game.in_draw() || this.props.game.in_stalemate() || this.props.game.in_threefold_repetition()){
        this.props.markWin(this.props.index, 'd');
    }
  }

  onMouseOverSquare = square => {
    // get list of possible moves for this square
    let moves = this.props.game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare = square => this.removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  onDragOverSquare = square => {
    this.setState({
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    });
  };

  onSquareRightClick = square =>
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } }
    });

  toggleClone = () => {
    this.setState({
      shouldClone: !this.state.shouldClone
    });
    console.log("Clone pushed!");
  }

  getTileColor = (isDark, isMyTurn) => {
    if (isMyTurn) {
      if (this.state.shouldClone) {
        if (isDark) {
          return { backgroundColor: 'rgb(181, 136, 200)' };
        } else {
          return { backgroundColor: 'rgb(240, 217, 200)' };
        }
      }
      if (isDark) {
        return { backgroundColor: 'rgb(181, 136, 99)' };
      } else {
        return { backgroundColor: 'rgb(240, 217, 181)' };
      }
    } else {
      if (isDark) {
        return { backgroundColor: 'rgb(90, 67, 50)' };
      } else {
        return { backgroundColor: 'rgb(120, 108, 90)' };
      }
    }
  }
  render() {
    const {dropSquareStyle, squareStyles } = this.state;

    return (
      <div className="SubGame" onMouseLeave={this.handleMouseLeave}>
        <Chessboard
              id="humanVsHuman"
              width={320}
              position={this.props.game.fen()}
              onDrop={this.onDrop}
              onMouseOverSquare={this.onMouseOverSquare}
              onMouseOutSquare={this.onMouseOutSquare}
              boardStyle={{
                borderRadius: "5px",
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
              }}
              darkSquareStyle={this.getTileColor(true, this.props.game.turn() === this.props.player)}
              lightSquareStyle={this.getTileColor(false, this.props.game.turn() === this.props.player)}
              squareStyles={squareStyles}
              dropSquareStyle={dropSquareStyle}
              onDragOverSquare={this.onDragOverSquare}
              onSquareClick={this.onSquareClick}
              onSquareRightClick={this.onSquareRightClick}
              undo={true}
              orientation={this.props.player === 'w' ? 'white' : 'black'}
            />
        {this.props.winner === '' && this.props.canClone ?
          <CloneButton onClick={this.toggleClone} shouldClone={this.state.shouldClone} /> : null }
        {this.props.winner === 'w' ?
          <h1>White wins</h1> : null }
        {this.props.winner === 'b' ?
          <h1>Black wins</h1> : null }
        {this.props.winner === 'd' ?
          <h1>Draw</h1> : null }
      </div>
      )
  }
}

export default Subgame;
