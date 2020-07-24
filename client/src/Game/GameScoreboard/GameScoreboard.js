import React from 'react'
import './GameScoreboard.css'

const gameScoreboard = (props) => {

	let stats = [
		props.subgames.map(subgame => subgame.winner === 'w' ? subgame.weight : 0).reduce((a, b) => a+b),
		props.subgames.map(subgame => subgame.winner === 'b' ? subgame.weight : 0).reduce((a, b) => a+b),
		props.subgames.map(subgame => subgame.winner === 'd' ? subgame.weight : 0).reduce((a, b) => a+b)
	];

	let overallWinner = '';
	if (stats[0] > .5-(stats[2]/2)) overallWinner = 'w';
	if (stats[1] > .5-(stats[2]/2)) overallWinner = 'b';
	if (stats[2] === 1) overallWinner = 'd';

	return (
		<div className="GameScoreboard">
			{overallWinner === 'w' ?
	          <h1>White wins!!</h1> : null }
	        {overallWinner === 'b' ?
	          <h1>Black wins!!</h1> : null }
	        {overallWinner === 'd' ?
	          <h1>Draw!!</h1> : null }
			<div className="GameScoreboardBar">
				<div className="WhiteScore Score" style={{width: stats[0]*100 + .1 + '%'}}></div>
				<div className="DrawScore Score" style={{width: stats[2]*100 + .1 + '%'}}></div>
				<div className="BlackScore Score" style={{width: stats[1]*100 + .1 + '%'}}></div>
			</div>
			<div className="GameScoreboardLabels">
				<div className="WhiteScoreLabel ScoreLabel">White: {stats[0]*100}%</div>
				<div className="BlackScoreLabel ScoreLabel">Black: {stats[1]*100}%</div>
				<div className="DrawScoreLabel ScoreLabel">Draw: {stats[2]*100}%</div>
			</div>
		</div>
		)
}

export default gameScoreboard;