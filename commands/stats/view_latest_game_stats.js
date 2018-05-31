const commando = require('discord.js-commando');
const sql = require("sqlite");

class ViewLatestGameStatsCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'viewlateststats',
      group: 'stats',
      memberName: 'viewlateststats',
      description: 'View Latest Match Stats'
    });
    this.gameID;
    this.mapName;
    this.bePlayers = [];
    this.dsPlayers = [];
  }

  run(message){
    return sql.open("./sql/stats.sqlite").then(() => {
      return this.getLatestGameID();
    })
    .then(() => {
      return Promise.all([
        this.getScore(0),
        this.getScore(1),
        this.getMap(),
        this.getPlayers(0),
        this.getPlayers(1)
      ]);
    })
    .then(data => {
      var beScore = data[0];
      var dsScore = data[1];
      var winner = beScore > dsScore ? "Blood Eagle" : "Diamond Sword";
      return Promise.all([
        message.reply("Map: " + this.mapName +
          "\nWinnder: " + winner  +
          "\nBlood Eagle Score: " + beScore  +
          "\nDiamond Sword Score: " + dsScore +
          "\nBlood Ealge Players: " + this.bePlayers.join(', ') +
          "\nDiamond Sword Players: " + this.dsPlayers.join(', ')
        ),
        sql.close()
      ]);
    });
  }

  getLatestGameID() {
    this.gameID = 0;
    return sql.get("SELECT MAX(gameID) AS id FROM gameMap").then(row => {
      this.gameID = row.id;
      return this;
    });
  }

  getMap() {
    var passed = true;
    var mapID = 0;

    return sql.get("SELECT * FROM gameMap WHERE gameID = (?)", this.gameID).then(row => {
      if(!row){
        console.error("gameID does not exist!");
        mapName = -1;
        return
      }
      return sql.get("SELECT mapID as id FROM gameMap WHERE gameID = (?)", this.gameID).then(row => {
        mapID = row.id;
        return sql.get("SELECT mapName as name FROM maps WHERE mapID = (?)", mapID).then(row => {
          this.mapName = row.name;
          return
        });
      });
    });
  }

  getScore(teamID){
    return sql.get("SELECT * FROM gameScore WHERE gameID = (?) AND teamID = (?)", this.gameID, teamID).then(row => {
      if(!row){
        console.error("Matching gameID and teamID doesn not exist!");
        return
      }
      return sql.get("SELECT score as score FROM gameScore WHERE gameID = (?) AND teamID = (?)", this.gameID,teamID).then(row => {
       return row.score;
      });
    });
  }

  getPlayers(teamID){
    sql.get("SELECT * FROM gamePlayerTeam WHERE gameID = (?) AND teamID = (?)", this.gameID, teamID).then(row => {
      if(!row) {
        console.error("Matching gameID and teamID doesn not exist!");
        return
      }
    });
    return sql.each("SELECT playerID as id FROM gamePlayerTeam WHERE gameID = (?) AND teamID = (?)", this.gameID, teamID).then(row => {
      return sql.get("SELECT playerName as name FROM players WHERE playerID = (?)", row.id).then(row => {
        //Todo work out why it's only printing 1 player from each team
        if(teamID == 0){
          this.bePlayers.push(row.name);
        } else {
          this.dsPlayers.push(row.name);
        }
        return;
    });
  });
  }
}
module.exports = ViewLatestGameStatsCommand;