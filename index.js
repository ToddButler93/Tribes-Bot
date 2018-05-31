const commando = require('discord.js-commando')
const bot = new commando.Client();
const sql = require("sqlite");
require('dotenv').load();

const createTeamsTable = "CREATE TABLE IF NOT EXISTS teams( teamID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, teamName text NOT NULL UNIQUE)";
const createPlayerTable = "CREATE TABLE IF NOT EXISTS players( playerID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, playerName text UNIQUE NOT NULL)";
const createSmurfTable = "CREATE TABLE IF NOT EXISTS players( smurfName PRIMARY KEY NOT NULL, playerID INTEGER NOT NULL,\
    FOREIGN KEY (playerID) REFERENCES players(playerID))";
const createMapsTable = "CREATE TABLE IF NOT EXISTS maps( mapID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, mapName text UNIQUE NOT NULL)";
const createGameStatsTable = "CREATE TABLE IF NOT EXISTS gameStats( gameID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, mapID INTEGER, FOREIGN KEY (mapID) REFERENCES maps(mapID))";
const creategameInfoTable = "CREATE TABLE IF NOT EXISTS gameInfo( gameID INTEGER NOT NULL, teamID INTEGER NOT NULL, score INTEGER, \
FOREIGN KEY (gameID) REFERENCES gameStats(gameID),\
FOREIGN KEY (teamID) REFERENCES teams(teamID),\
primary key (gameID, teamID))";
const creategamePlayerInfoTable = "CREATE TABLE IF NOT EXISTS gamePlayerInfo( gameID INTEGER NOT NULL, teamID INTEGER NOT NULL, playerID INTEGER NOT NULL,\
FOREIGN KEY (gameID) REFERENCES gameStats(gameID),\
FOREIGN KEY (teamID) REFERENCES teams(teamID),\
FOREIGN KEY (playerID) REFERENCES players(playerID)\
primary key (gameID, playerID))";
const InsertTeamBE = "INSERT INTO teams VALUES (0, 'Blood Eagle')";
const InsertTeamDS = "INSERT INTO teams VALUES (1, 'Diamond Sword')";

bot.registry.registerGroup('stats', 'Stats');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

async function runStartUp(){
    await sql.open("./sql/stats.sqlite");
    await sql.run(createTeamsTable);
    await sql.run(creategameInfoTable);
    await sql.run(creategamePlayerInfoTable);
    await sql.run(createGameStatsTable);
    await sql.run(createMapsTable);
    await sql.run(createPlayerTable);
    await sql.run(createSmurfTable);

    //Add Teams
    await insertTeams();
    await sql.close();
}

async function insertTeams(){
    
    await sql.get("SELECT * FROM teams WHERE teamName = (?)", 'Blood Eagle').then(row => {
        if (!row) {
            sql.run(sqlStrings.InsertTeamBE);
            sql.run(sqlStrings.InsertTeamDS);
        }else console.log("Teams exists.");
      }).catch(() => {
        console.error;
      });
      return await sql.get("SELECT last_insert_rowid()");
}

bot.on("ready", () => {
    runStartUp;
})

bot.login(process.env.TOKEN);
