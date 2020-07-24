const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  gameSchema  =  new Schema({
    id:  String,
    subgames: [{history: [String], weight: Number, angle: Number, winner: String}]
});
let  Game  =  mongoose.model("Game", gameSchema);

module.exports  =  Game;