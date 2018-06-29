const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const commando = require('discord.js-commando');
const sql = require("sqlite");
require('dotenv').load();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'credentials.json';

class ReadGoogleDocCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'readgoogledoc',
      group: 'stats',
      memberName: 'readgoogledoc',
      description: 'Update databases SQL data.'
    });
  }
  run(message){
    this.readData();
  }
  readData(){
    fs.readFile('client_secret.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      this.authorize(JSON.parse(content), this.listGames);
    });
  }

  authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return this.getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
  listGames(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    var games = [];
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEETID,
      //Date,MapName,Blood Eagle Score, Player1, Player2, Player3, Player4, Player5, Player6, Player7,Diamond Sword Score, Player1, Player2, Player3, Player4, Player5, Player6, Player7
      range: 'Raw Export Data!A2:T',
    }, (err, {data}) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = data.values;
      if (rows.length) {
        rows.map((row) => {
          var game = {
            date:`${row[0]}`, 
            map:`${row[1]}`, 
            beScore:`${row[2]}`, 
            bePlayers:`${row[3]}, ${row[4]}, ${row[5]}, ${row[6]}, ${row[7]}, ${row[8]}, ${row[9]}`, 
            dsScore:`${row[10]}`, 
            dsPlayers:`${row[11]}, ${row[12]}, ${row[13]}, ${row[14]}, ${row[15]}, ${row[16]}, ${row[17]}`
          };
          console.log("Date: " + game['date'] + " Map: " + game['map'] + " Blood Eagle Score: " + game['beScore'] + " Diamond Sword Score: " + game['dsScore']);
          games.push(game);
        });
      } else {
        console.log('No data found.');
      }
      console.log('Number of games imported: ' + games.length);
    })
  }
}


module.exports = ReadGoogleDocCommand;