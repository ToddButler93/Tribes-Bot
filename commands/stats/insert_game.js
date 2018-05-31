const commando = require('discord.js-commando');
const sql = require("sqlite");

class InsertGameCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'insertgame',
      group: 'stats',
      memberName: 'insertgame',
      description: 'Insert Game Data.',
      args: [
        {
            key: 'gameData',
            prompt: 'Insert game data',
            type: 'string'
        }
        ]
    });
    this.gameID;
    this.mapName;
    this.gameDataString;
    this.gameDataArray = [];
    this.beGameData = [];
    this.dsGameData = [];
    this.beScore;
    this.dsScore;
    this.winner;
  }

  run(message, {gameData}){
    return sql.open("./sql/stats.sqlite").then(() => {
      return this.gameDataString = gameData.replace(/ *\[[^\]]*]/g, '').replace(/ /g,'').replace(/TrCTF-/g,'');
    })
    .then(() => {
        return Promise.all([
        //Split teams
        this.gameDataArray = this.gameDataString.split("\n"),
        //Split team data
        this.beGameData = this.gameDataArray[0].split(','),
        this.dsGameData = this.gameDataArray[1].split(','),
        this.mapName = this.beGameData[0].replace(/([A-Z])/g, ' $1').trim(),
        this.beScore = this.beGameData[1],
        this.dsScore = this.dsGameData[1],
        this.winner = this.beGameData[1] > this.dsGameData[1] ? "Blood Eagle" : "Diamond Sword"
      ]);
    })//Vaiidate
    .then(()=>{
        return Promise.all([
            this.validateData()
          ]);
    })
    .then(data =>{
        if(data[0]){
            return this.insertMap().then(() => {
                return this.insertGameMap().then(() => {
                this.insertPlayers(),
                this.insertGameScore(this.gameID, 0, this.beScore),
                this.insertGameScore(this.gameID, 1, this.dsScore)
              });
            })
        }else{
            console.error("Something wrong with the data.");
            return
        }
    }).then(()=>{
        message.reply("Map: " + this.mapName + 
                    "\nWinner: " + this.winner  + 
                    "\nBlood Eagle Score: " + this.beScore  + 
                    "\nDiamond Sword Score: " + this.dsScore + 
                    "\nBlood Ealge Players: " + this.beGameData[2] + ", "+ this.beGameData[3] + ", "+ this.beGameData[4] + ", "+ this.beGameData[5] + ", "+ this.beGameData[6] + ", "+ this.beGameData[7] + ", "+ this.beGameData[8] +
                    "\nDiamond Sword Players: " + this.dsGameData[2] + ", "+ this.dsGameData[3] + ", "+ this.dsGameData[4] + ", "+ this.dsGameData[5] + ", "+ this.dsGameData[6] + ", "+ this.dsGameData[7] + ", "+ this.dsGameData[8]);
    });
  }

  validateData(){
    if(!isNaN(this.beScore) && !isNaN(this.beScore)){
        if(typeof this.beGameData[8] != 'undefined' && typeof this.dsGameData[8] != 'undefined'){
            return true;
        }else console.error("Not enough data added."); return false;
    }else console.error("Score is not a number."); return false;
    }

    insertMap(){
    return sql.get("SELECT * FROM maps WHERE mapName = (?)", this.mapName).then(row => {
        if (!row) {
            console.log("Inserting Map.");
            return sql.run("INSERT INTO maps VALUES (NULL,?)", this.mapName).then(row => {
                return sql.get("SELECT mapID as id FROM maps WHERE mapName = (?)", this.mapName).then(row => {
                    this.mapID = row.id;
                    return
                });
            });
        }else {
            console.log("Map exists.");
            return sql.get("SELECT mapID as id FROM maps WHERE mapName = (?)", this.mapName).then(row => {
                this.mapID = row.id;
                return
            });
        }
      });
    }
    //Todo test if function even works properly.
    async insertPlayers(){
        for(var i = 0; i < 7; i++){
            var playerID = await this.insertPlayer(this.beGameData[i + 2]);
            await this.insertGamePlayers(this.gameID, 0, playerID);
            
            playerID = await this.insertPlayer(this.dsGameData[i + 2]);
            await this.insertGamePlayers(this.gameID, 1, playerID);
        }
    }

    insertPlayer(playerName){
        return sql.get("SELECT * FROM players WHERE playerName = (?)", playerName).then(row => {
            if (!row) {
                return sql.run("INSERT INTO players VALUES (NULL,?)", playerName).then(row => {
                    return sql.get("SELECT playerID AS id FROM players WHERE playerName = (?)", playerName).then(row => {
                        console.log("Inserted " + row.id+ ":" + playerName + " Data.");
                        return row.id
                    });
                });
            }else {
                console.log("Player exists.");
                return sql.get("SELECT playerID AS id FROM players WHERE playerName = (?)", playerName).then(row => {
                    console.log("Grabbed " + row.id+ ":" + playerName + " Data.");
                    return row.id
                });
            }
          });
    }

    insertGameMap(){
        console.log("Inserting Game Map.");
        return sql.run("INSERT INTO gameMap VALUES (NULL,?)", this.mapID).then(row => {
            return sql.get("SELECT MAX(gameID) AS id FROM gameMap").then(row => {
                return this.gameID = row.id;
            });
        });
    }

    insertGameScore(gameID, teamID, score){
        var inserts = [gameID, teamID, score];
        return sql.get("SELECT * FROM gameScore WHERE gameID = (?) AND teamID = (?)", gameID,teamID).then(row => {
        if (!row) {
            console.log("Inserting Score Data.");
            return sql.run("INSERT INTO gameScore (gameID,teamID,score) VALUES (?,?,?)", inserts);
        }else console.error("Game data with gameID and teamID exists.");
        });
    }

    insertGamePlayers(gameID,teamID, playerID){
    var inserts = [gameID, teamID, playerID];
    return sql.get("SELECT * FROM gamePlayerTeam WHERE gameID = (?) AND playerID = (?)", gameID,playerID).then(row => {
        if (!row) {
          console.log("Inserting Game PlayerInfo.");
          return sql.run("INSERT INTO gamePlayerTeam (gameID,teamID,playerID) VALUES (?,?,?)", inserts);
        }
      });
    }
}
module.exports = InsertGameCommand;