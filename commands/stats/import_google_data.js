const fs = require('fs');
const readline = require('readline');
const commando = require('discord.js-commando');
const sql = require("sqlite");
require('dotenv').load();

const GoogleSpreadsheet = require('google-spreadsheet');

class UpdateSQLCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'updatesql',
      group: 'stats',
      memberName: 'updatesql',
      description: 'Update databases SQL data.'
    });
    this.gameData = [];
  }
  run(message){
    return sql.open("./sql/stats.sqlite").then(() => {
        return Promise.all([
            this.gameData = this.readData()
    ])});
  }
  readData(){
    var creds = require('./client_secret.json');
    // Create a document object using the ID of the spreadsheet - obtained from its URL.
    var doc = new GoogleSpreadsheet('1NuPXiSj87Gg8iQngK3Mj6DZp7kcPVRx05ctk6WKWFwA');
    // Authenticate with the Google Spreadsheets API.
    doc.useServiceAccountAuth(creds, function (err) {
        // Get all of the rows from the spreadsheet.
        doc.getRows(1, function (err, rows) {
            rows.forEach(row => {
                //console.log(row.value);
            console.log("Date: " + row['date'] + " Map: " + row['map'] + " BE: " + row['bescore'] + " DS: " + row['dsscore']);

            /*
            return mapID =  this.insertMap(game['map']).then(() => {
                return gameID = this.insertGameMap(mapID, game['date']).then(() => {
                    this.insertPlayers(gameID),
                        this.insertGameScore(gameID, 0, this.beScore),
                        this.insertGameScore(gameID, 1, this.dsScore)
                });
            })
            */

            });
        });
    });
  }
}

module.exports = UpdateSQLCommand;