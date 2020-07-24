import React, {Component} from 'react';
import './App.css';

import Chess from "chess.js";
import axios from "axios";
import openSocket from 'socket.io-client';
import Cookies from 'universal-cookie';

import Game from './Game/Game';
import Menu from './Menu/Menu';

class App extends Component {

  state = {
  	playerColor: 'w',
	subgames: [],
	gameId: '',
	error: '',
	showMenu: true
  }

  socket = null;
  cookies = new Cookies();

  componentDidMount() {

	this.socket = openSocket(window.location.hostname + ":" + (process.env.PORT || 9000));
	this.socket.on('update', subgames => {
		this.setState({
			subgames: this.unBundleSubgames(subgames)
		});
	});
	if(this.cookies.get('savedId') && this.cookies.get('savedColor')) {
		this.loadHandler(this.cookies.get('savedId'), this.cookies.get('savedColor'))();
	}
	alert(window.location.hostname + ":" + (process.env.PORT || 9000));
  }

  toggleMenuHandler = () => {
  	this.setState({
  		showMenu: !this.state.showMenu
  	});
  }

  newHandler = (gameId, playerColor) => {
  	return () => {
  		if (gameId === '') {
	  		this.setState({error: "Specify a game ID to create."});
	  		return;
		}
		this.socket.emit('exists', gameId, exists => {
			if (exists) {
				this.setState({
		  			error: 'A game with that ID already exists.',
				}); 
				return
			} else {
				this.setState({
					playerColor: playerColor,
					subgames: [
						{game: new Chess(),
						 weight: 1.0,
						 angle: 0,
						 winner: ''
						}
					],
					gameId: gameId,
					error: '',
					showMenu: true
				}); 
				this.cookies.set('savedId', gameId, { path: '/' });
				this.cookies.set('savedColor', playerColor, { path: '/' });
				this.saveGame();
			}
		});
	}
  }

  bundleSubgames = ()  => {
  	let bundledSubgames = this.state.subgames.map(subgame => {
  		return {
  			history: subgame.game.history(),
  			weight: subgame.weight,
  			angle: subgame.angle,
  			winner: subgame.winner
  		};
  	});
  	return bundledSubgames;
  }

  saveGame = () => {
	  this.socket.emit("save", {id: this.state.gameId, subgames: this.bundleSubgames()});
  }

  unBundleSubgames = (subgames)  => {
  	let unBundledSubgames = subgames.map(subgame => {
  		let game = new Chess();
  		subgame.history.forEach((move, index) => {game.move(move)});
  		return {
  			game: game,
  			weight: subgame.weight,
  			angle: subgame.angle,
  			winner: subgame.winner
  		};
  	});
  	return unBundledSubgames;
  }

  loadHandler = (gameId, playerColor) => {
  	return () => {
  		if (gameId === '') {
	  		this.setState({error: "Specify a game ID to load."});
	  		return;
		}
		this.socket.emit('load', gameId, subgames => {
			if (subgames) {
				this.setState({
					subgames: this.unBundleSubgames(subgames),
		  			gameId: gameId,
		  			playerColor: playerColor,
		  			error: '',
		  			showMenu: false
				}); 
				this.cookies.set('savedId', gameId, { path: '/' });
				this.cookies.set('savedColor', playerColor, { path: '/' });
			} else {
				this.setState({
		  			error: 'No such game to load.',
				}); 
			}
		});
  	}
  }
	
	

	updateSubgameHandler = (index, move) => {
		let subgames = this.state.subgames;
		subgames[index].game.move(move);
		this.setState( {
			subgames: subgames
		});
		this.saveGame();
	}

	addSubgameHandler = (callerIndex, newFen) => {
		let subgames = this.state.subgames;
		subgames[callerIndex].weight = subgames[callerIndex].weight/2;
		
		// Create a fresh game and re-create the cloned one move-by-move.
		let newGame = new Chess();
		subgames[callerIndex].game.history().forEach((move, index) => newGame.move(move));
		
		let newSubgame = {
			game: newGame,
			weight: subgames[callerIndex].weight,
			angle: subgames[callerIndex].weight + subgames[callerIndex].angle,
			winner: ''
		};

		subgames.push(newSubgame);
		this.setState( {
			subgames: subgames,
		});
		this.saveGame();
	}

	// Called from subgame
	markWin = (callerIndex, winner) => {
		let subgames = this.state.subgames;
		subgames[callerIndex].winner = winner;
		this.setState({subgames: subgames});
	}

  render() {
	  return (
	    <div className="App">
	      <h1>Welcome to MultiChess</h1>
	      {this.state.gameId !== '' ? (<h3>Game ID: {this.state.gameId}</h3>) : null}
	      {this.state.error !== '' ? (
	      	<h2 className="Error">{this.state.error}</h2>
	      ) : null}
	      <Menu playerColor={this.state.playerColor} loadHandler={this.loadHandler} newHandler={this.newHandler} toggleMenuHandler={this.toggleMenuHandler} show={this.state.showMenu}/>
	      {this.state.gameId !== '' ? (
		      <Game playerColor={this.state.playerColor}
		      		subgames={this.state.subgames}
		      		addSubgameHandler={this.addSubgameHandler}
		      		updateSubgameHandler={this.updateSubgameHandler}
		      		markWin={this.markWin}/>
		   ) : null}
	    </div>
	  );
  }
}

export default App;
