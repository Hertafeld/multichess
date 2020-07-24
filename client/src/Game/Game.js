import React, { Component } from "react";
import Chess from "chess.js";

import C from "../constants.js";
import Subgame from "./Subgame/Subgame"; 
import GameScoreboard from "./GameScoreboard/GameScoreboard"; 
import GameChart from "./GameChart/GameChart";
import "./Game.css";

class Game extends Component {
	state = {
		selectedIndex: 0
	}

	updateIndexHandler = index => {
		this.setState( {
			selectedIndex: index
		});
	}

	changeColor = () => {
		this.setState({color: this.state.color === 'w' ? 'b' : 'w'});
	}

	render() {
	  return (
	  	<div>
	  		<GameScoreboard subgames={this.props.subgames} player={this.player} />
	  		<GameChart subgames={this.props.subgames} selectedIndex={this.state.selectedIndex} updateSubgameHandler={this.props.updateSubgameHandler} addSubgameHandler={this.props.addSubgameHandler} updateIndexHandler={this.updateIndexHandler} player={this.props.playerColor} markWin={this.props.markWin}/>
	  		<div className="SubgameTiles">
		    	{this.props.subgames.map((subgame, index) => {
		    		const style = {
		    			backgroundColor: C.COLORS[index % C.COLORS.length],
		    			borderColor: this.state.selectedIndex === index ? 'black' : 'white'
		    		};
		    		return (
		    			<div className="SubgameTile" style={style} key={index}>
		    				<Subgame game={subgame.game} winner={subgame.winner} index={index} update={this.props.updateSubgameHandler} clone={this.props.addSubgameHandler} player={this.props.playerColor} markWin={this.props.markWin} canClone={subgame.weight >= .25}/>
		    			</div>
		    		)
		    	})}
		    </div>
	    </div>
	  );
	}
}

export default Game;
