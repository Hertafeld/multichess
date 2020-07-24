import React, { Component } from "react";

import "./Menu.css"; 

class Menu extends Component {
	state = {
		gameId: '',
		playerColor: 'w',
		show: true
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
						<button onClick={this.props.toggleMenuHandler} >
							Hide Menu
						</button>
					</div>
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
