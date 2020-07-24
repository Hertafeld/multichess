var express = require('express');
var router = express.Router();

const  Game  = require("../models/GameSchema");
const  connection  = require("../db/connection");

/*
router.post('/', function(req, resp) {
	console.log(req.body);
	const newGame = new Game(req.body);
	Game.findOne({ id: req.body.id }, (err, gameFound) => {
		if (gameFound) {
			gameFound.subgames = newGame.subgames;
			gameFound.save();
		} else {
			newGame.save();
			console.log("Added game " + newGame.id);
		}
	});
});

module.exports = router;
*/

let socketHandler = (socket) => {
  console.log("A user connected.");
  socket.on('load', (gameId, sendBack) => {
  	let inRoom = false;
  	rooms = Object.keys(socket.rooms);
  	for (var i = 1; i < rooms.length; i++) {
  		if (rooms[i] == gameId) {
  			inRoom = true;
  		} else {
  			socket.leave(rooms[i]);
  			console.log("Left room " + rooms[i]);
  		}
  	}
  	if (!inRoom) {
  		socket.join(gameId);
  		console.log("Joined room " + gameId);
  	} else {
  		console.log("Already in room " + gameId);
  	}

  	Game.findOne({ id: gameId }, (err, gameFound) => {
		if (err) throw err;
		console.log("Sending game " + gameId);
		console.log(gameFound);
		sendBack(gameFound.subgames);
	});
  });

  socket.on('save', game => {
	const newGame = new Game(game);
	socket.to(game.id).emit('update', game.subgames);
	Game.findOne({ id: game.id }, (err, gameFound) => {
		if (err) throw err;
		if (gameFound) {
			gameFound.subgames = newGame.subgames;
			gameFound.save();
			console.log("Updated game " + gameFound.id);
		} else {
			newGame.save();
			console.log("Added game " + newGame.id);
		}
	});
  });
}

module.exports = socketHandler;
