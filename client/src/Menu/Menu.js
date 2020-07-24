import React, { Component } from "react";

import "./Menu.css"; 

class Menu extends Component {
	state = {
		gameId: '',
		playerColor: 'w',
		show: true,
		showHelp: false
	}

	render() {

		const style = {
			backgroundColor: this.state.playerColor === 'w' ? 'white' : 'black',
			color: '#888888'
		}

		if (this.props.show) {
		  	return (
		  		<div className="Menu">
			  		<div className="FileMenu">
				  		<label>Game ID: </label> <input type="text" onChange={event => this.setState({gameId: event.target.value})}/>
						<button onClick={this.props.newHandler(this.state.gameId, this.state.playerColor)}>New</button>
						<button onClick={this.props.loadHandler(this.state.gameId, this.state.playerColor)}>Load</button>
					</div>
					<div className="ColorMenu">
						<button onClick={() => this.setState({playerColor: this.state.playerColor === 'w' ? 'b' : 'w'})} style={style}>
							Playing as {this.state.playerColor === 'w' ? 'White' : 'Black'} (click to change)
						</button>
					</div>
					<div className="HideMenu">
						<button onClick={() => this.setState({showHelp: !this.state.showHelp})}>
							{this.state.showHelp ? 'Hide Help' : 'How to play'}
						</button>
						<button onClick={this.props.toggleMenuHandler} >
							Hide Menu
						</button>
					</div>
					{this.state.showHelp ? (
						<div className='HelpText'>
							<h4>To connect</h4>
							<p><br></br>Choose a color and a game ID (eg "mike123") and click "New"</p>
							<p>Have a friend choose the other color and "Load" the same game ID</p>
							<h4>To play</h4>
							<p>The game starts with a single board worth 100% of the match. Play chess as normal, but
							   at any time a player may "Clone" the board with a move. The board will split into two
							   chess games, one in which the player made the move and the other in which they didn't.
							   Each board is now worth half the game. These boards may be split into quarter games, 
							   which can be split into eighth games.</p>
							<p>Should you split strong positions to gain more boards in your favor? Or split when
							   pressed to divide the opponent's attention? </p>
							<p>The game ends when a player wins the majority of the available (ie non-draw) board value. </p>
						</div>
					) : null }
				</div>
	  		);
		  } else {
		  	return (
		  		<div className="MenuHidden">
			  		<button className="MenuButton" onClick={this.props.toggleMenuHandler}>
						Menu
					</button>
				</div>
		  	)
		  }
	}
}

export default Menu;
