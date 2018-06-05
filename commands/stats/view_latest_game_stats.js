const commando = require('discord.js-commando');
const sql = require("sqlite");

class ViewLatestGameStatsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'latest',
      group: 'stats',
      memberName: 'latest',
      description: 'View Latest Match Stats'
    });
    this.gameID;
    this.mapName;
    this.bePlayers = [];
    this.dsPlayers = [];
    this.gameDate;
  }

  run(message) {
    return sql.open("./sql/stats.sqlite").then(() => {
        return this.getLatestGameID();
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

  getDate() {
    return sql.get("SELECT * FROM gameMap WHERE gameID = (?)", this.gameID).then(row => {
      if (!row) {
        console.error("Matching gameID doesn not exist!");
        return
      }
      return sql.get("SELECT gameDate as date FROM gameMap WHERE gameID = (?)", this.gameID).then(row => {
        this.gameDate = row.date;
        return this;
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
module.exports = ViewLatestGameStatsCommand;