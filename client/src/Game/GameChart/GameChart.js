import React, { Component } from "react";
import Chart from 'react-apexcharts';
import C from '../../constants.js';
import './GameChart.css';
import Subgame from '../Subgame/Subgame';



class GameChart extends Component {
	

	updateFocusHandler = index => {
		
	}

	updateSelectHandler = (event, chartContext, config) => {
		let lookupTable = this.props.subgames.map((subgame, index) => {
			return {
				angle: subgame.angle,
				index: index
			}
		});
		lookupTable.sort(function(a, b){return a.angle-b.angle});
		this.props.updateIndexHandler(lookupTable[config.dataPointIndex].index);
 	}

 	getSliceColor = (index, subgame) => {
 		if (subgame.winner === 'w') {
 			return 'rgb(240, 240, 240)';
 		} else if (subgame.winner === 'b') {
 			return 'rgb(15, 15, 15)';
 		} else if (subgame.winner === 'd') {
 			return 'rgb(127, 127, 127)';
 		}
 		let colorString = C.COLORS[index % C.COLORS.length];
 		let colorList = [parseInt(colorString.substr(1,2),16),
             			 parseInt(colorString.substr(3,2),16),
             			 parseInt(colorString.substr(5,2),16)]
        if (subgame.game.turn() !== this.props.player) {
        	//colorList = colorList.map(x => x/2);
        }
        colorString = "rbg(" + colorList[0] + ", " + colorList[1] + ", " + colorList[2] + ")";
		return "rgb(" + colorList[0] + ", " + colorList[1] + ", " + colorList[2] + ")"
	}

	mouseoverSegmentHandler = (event, chartContext, config) => {

	}

	render() {

		let data = this.props.subgames.map((subgame, index) => {


			return {
				title: subgame.fen,
				value: subgame.weight,
				color: this.getSliceColor(index, subgame),
				angle: subgame.angle,
				index: index,
				turn: subgame.game.turn(),
				pattern: subgame.game.turn() === this.props.player || subgame.winner !== '' ? 'none' : 'circles'
			}
		});

		data.sort(function(a, b){return a.angle-b.angle});
		const style = {
			backgroundColor: C.COLORS[this.props.selectedIndex % C.COLORS.length]
		};

	  	return (
		  	<div className="GameChart">
				<div className="GameChartPie">
					{console.log(data.map(x => x.pattern))}
					<Chart
					    options={{
					    	legend: false,
					    	fill: {
					    		colors: data.map(x => x.color),
        						type: data.map(x => x.pattern === 'none' ? 'solid' : 'pattern'),
        						opacity: 1,
        						pattern: {
						          enabled: true,
						          style: data.map(x => x.pattern),
						          height: 5,
						          width: 5,
						          strokeWidth: 3
						        }
					    	},
					    	chart: {
					    		events: {
					    			dataPointSelection: this.updateSelectHandler,
					    			dataPointMouseEnter: this.mouseoverSegmentHandler
					    		}
					    	},
					    	tooltip: {
					    		enabled: false
					    	}							
					    }}
              			series={data.map(x => x.value)}
              			type="pie"
              			width="300"
					/>
				</div>
				<div className="GameChartBoard" style={style}>
					<Subgame game={this.props.subgames[this.props.selectedIndex].game} winner={this.props.subgames[this.props.selectedIndex].winner} index={this.props.selectedIndex} update={this.props.updateSubgameHandler} clone={this.props.addSubgameHandler} player={this.props.player} markWin={this.props.markWin} canClone={this.props.subgames[this.props.selectedIndex].weight >= .25}/>
				</div>
			</div>
		);
	}
}

export default GameChart;
