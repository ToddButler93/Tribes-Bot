const commando = require('discord.js-commando');
const sql = require("sqlite");

class ViewSpecificGameStatsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'game',
      group: 'stats',
      memberName: 'game',
      description: 'View a particular games match stats',
      args: [{
          key: 'gameID',
          prompt: 'Which game (ID) would you like to view stats for?',
          type: 'string'
      }]
    });
    this.gameID;
    this.mapName;
    this.bePlayers = [];
    this.dsPlayers = [];
    this.gameDate;
  }

  run(message, {gameID}) {
    return sql.open("./sql/stats.sqlite").then(() => {
        return this.gameID = gameID;
      })
      .then(() => {
        return Promise.all([
          this.getScore(0),
          this.getScore(1),
          this.getDate(),
          this.getMap(),
          this.getPlayers(0),
          this.getPlayers(1)
        ]);
      }).then(data => {
        var formattedDate = "" + [this.gameDate.slice(0, 4), "/", this.gameDate.slice(4)].join('');
        formattedDate = [formattedDate.slice(0, 7), "/", formattedDate.slice(7)].join('');

        message.channel.send("Game Date: " + formattedDate +
        "\nMap: " + this.mapName +
        "\nWinner: " + (data[0] > data[1] ? "Blood Eagle" : "Diamond Sword") +
        "\nBlood Eagle Score: " + data[0] +
        "\nDiamond Sword Score: " + data[1] +
        "\nBlood Ealge Players: " + this.bePlayers.join(', ') +
        "\nDiamond Sword Players: " + this.dsPlayers.join(', '));
      }).then(() => {
        sql.close();
      });
  }

  getMap() {
    var passed = true;
    var mapID = 0;

    return sql.get("SELECT * FROM gameMap WHERE gameID = (?)", this.gameID).then(row => {
      if (!row) {
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

  getScore(teamID) {
    return sql.get("SELECT * FROM gameScore WHERE gameID = (?) AND teamID = (?)", this.gameID, teamID).then(row => {
      if (!row) {
        console.error("Matching gameID and teamID doesn not exist!");
        return
      }
      return sql.get("SELECT score as score FROM gameScore WHERE gameID = (?) AND teamID = (?)", this.gameID, teamID).then(row => {
        return row.score;
      });
    });
  }
  getDate() {
    return sql.get("SELECT * FROM gameMap WHERE gameID = (?)", this.gameID).then(row => {
      if (!row) {
        console.error("Matching gameID doesn not exist!");
        return
      }
      return sql.get("SELECT gameDate as gameDate FROM gameMap WHERE gameID = (?)", this.gameID).then(row => {
        this.gameDate = row.gameDate;
        console.log(row.gameDate);
        return this;
      });
    });
  }

  getPlayers(teamID) {
    var inserts = [this.gameID, teamID];
    sql.get("SELECT * FROM gameScore WHERE gameID = (?) AND teamID = (?)", this.gameID, teamID).then(row => {
      if (!row) {
        console.error("Matching gameID and teamID doesn not exist!");
        return
      }
    });
    return sql.each("SELECT playerID as id FROM gamePlayerTeam WHERE gameID = (?) AND teamID = (?)", inserts, (err, row) => {
      return sql.get("SELECT playerName as name FROM players WHERE playerID = (?)", row.id).then(row => {
        if (teamID == 0) {
          this.bePlayers.push(row.name);
        } else {
          this.dsPlayers.push(row.name);
        }
        return this;
      });
    });
  }
}
module.exports = ViewSpecificGameStatsCommand;