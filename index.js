const commando = require('discord.js-commando')
const bot = new commando.Client();
const sql = require("sqlite");
require('dotenv').load();

const createTeamsTable = "CREATE TABLE IF NOT EXISTS teams( teamID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, teamName text NOT NULL UNIQUE)";
const InsertTeamBE = "INSERT OR IGNORE INTO teams VALUES (0, 'Blood Eagle')";
const InsertTeamDS = "INSERT OR IGNORE INTO teams VALUES (1, 'Diamond Sword')";

const createPlayerTable = "CREATE TABLE IF NOT EXISTS players( playerID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, playerName text UNIQUE NOT NULL)";
const createSmurfTable = "CREATE TABLE IF NOT EXISTS smurfs( smurfName PRIMARY KEY NOT NULL, playerID INTEGER NOT NULL,\
    FOREIGN KEY (playerID) REFERENCES players(playerID))";

const createMapsTable = "CREATE TABLE IF NOT EXISTS maps( mapID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, mapName text UNIQUE NOT NULL)";

const createGameMapTable = "CREATE TABLE IF NOT EXISTS gameMap( gameID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, mapID INTEGER, FOREIGN KEY (mapID) REFERENCES maps(mapID))";
const createGameScoreTable = "CREATE TABLE IF NOT EXISTS gameScore( gameID INTEGER NOT NULL, teamID INTEGER NOT NULL, score INTEGER, \
FOREIGN KEY (gameID) REFERENCES gameMap(gameID),\
FOREIGN KEY (teamID) REFERENCES teams(teamID),\
primary key (gameID, teamID))";

const createGamePlayerTeamTable = "CREATE TABLE IF NOT EXISTS gamePlayerTeam( gameID INTEGER NOT NULL, teamID INTEGER NOT NULL, playerID INTEGER NOT NULL,\
FOREIGN KEY (gameID) REFERENCES gameMap(gameID),\
FOREIGN KEY (teamID) REFERENCES teams(teamID),\
FOREIGN KEY (playerID) REFERENCES players(playerID)\
primary key (gameID, playerID))";

bot.registry.registerGroup('stats', 'Stats');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.on("ready", () => {
    return sql.open("./sql/stats.sqlite") .then(()=>{
        return Promise.all([
            sql.run(createTeamsTable),
            sql.run(createPlayerTable),
            sql.run(createSmurfTable),
            sql.run(createMapsTable),
            sql.run(createGameMapTable),
            sql.run(createGameScoreTable),
            sql.run(createGamePlayerTeamTable)
            //Add Teams
          ]);
    }).then(()=>{
        return Promise.all([
            sql.run(InsertTeamBE),
            sql.run(InsertTeamDS)
            //Add Teams
          ]);
    }).then(()=>{
        sql.close();
    })
    console.log("Setting up database");
})
bot.login(process.env.TOKEN);

