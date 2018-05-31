const commando = require('discord.js-commando');
const sql = require("sqlite");


async function insertMap(mapName){
    var mapID = 0;
    await sql.get("SELECT * FROM maps WHERE mapName = (?)", mapName).then(row => {
        if (!row) {
            console.log("Inserting Map.");
            sql.run("INSERT INTO maps VALUES (NULL,?)", mapName);
        }else {
            console.log("Map exists.");
        }
      });
      await sql.get("SELECT mapID AS id FROM maps WHERE mapName = (?)", mapName).then(row => {
          mapID = row.id;
      });
      return mapID;
}

async function insertGameStats(mapID){
    var gameID = 0;
    console.log("Inserting Game Stats.");
    await sql.run("INSERT INTO gameStats VALUES (NULL,?)", mapID).catch(() => {
        console.error;
        sql.run(sqlStrings.createGameStatsTable).then(() => {
            sql.run("INSERT INTO gameStats VALUES (NULL,?)", mapID);
        });
    });
    await sql.get("SELECT MAX(gameID) AS id FROM gameStats").then(row => {
        gameID = row.id;
    })
    return gameID;
}
async function insertPlayerData(playerName){
    var playerID = 0;
    await sql.get("SELECT * FROM players WHERE playerName = (?)", playerName).then(row => {
        if (!row) {
          console.log("Inserting Player Data.");
          sql.run("INSERT INTO players VALUES (NULL,?)", playerName);
        }else {
            console.log("Player exists.");
        };
      }).catch(() => {
        console.error;
        sql.run(sqlStrings.createPlayerTable).then(() => {
            console.log("Inserting Player Data.");
            sql.run("INSERT INTO players VALUES (NULL,?)", playerName);
        });
      });
      await sql.get("SELECT playerID AS id FROM players WHERE playerName = (?)", playerName).then(row => {
        playerID = row.id;
        console.log(playerID);
      });
      return playerID;
}
async function insertGameData(gameID, teamID, score){
    var inserts = [gameID, teamID, score];
    await sql.get("SELECT * FROM gameInfo WHERE gameID = (?) AND teamID = (?)", gameID,teamID).then(row => {
        if (!row) {
          console.log("Inserting Game Data.");
          sql.run("INSERT INTO gameInfo (gameID,teamID,score) VALUES (?,?,?)", inserts);
          //console.log(sql.get("SELECT * FROM gameStats WHERE gameID = (?) AND teamID = (?)",{gameID,teamID}));
        }else console.error("Game data with gameID and teamID exists.");
      }).catch(() => {
        console.error;
        sql.run(sqlStrings.creategameInfoTable).then(() => {
            sql.run("INSERT INTO gameInfo (gameID,teamID,score) VALUES (?,?,?)", inserts);
        });
      });
}
async function insertGamePlayerInfo(gameID, teamID, playerID){
    var inserts = [gameID, teamID, playerID];
    await sql.get("SELECT * FROM gamePlayerInfo WHERE gameID = (?) AND playerID = (?)", gameID,playerID).then(row => {
        if (!row) {
          console.log("Inserting Game PlayerInfo.");
          sql.run("INSERT INTO gamePlayerInfo (gameID,teamID,playerID) VALUES (?,?,?)", inserts);
        }
      }).catch(() => {
        console.error;
        sql.run(sqlStrings.creategamePlayerInfoTable).then(() => {
            console.log("Inserting Game PlayerInfo.");
            sql.run("INSERT INTO gamePlayerInfo (gameID,teamID,playerID) VALUES (?,?,?)", inserts);
        });
      });
}


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
    }

    async run(message, {gameData}){
        await sql.open("./sql/stats.sqlite");

        //remove clan tag
        var tempGameData = gameData.replace(/ *\[[^\]]*]/g, '');
        //remove spaces
        tempGameData = tempGameData.replace(/ /g,'');
        //Remove Map prefix
        tempGameData = tempGameData.replace(/TrCTF-/g,'');
        //Split teams
        var tempGameDataArray = tempGameData.split("\n");
        //Split team data
        var beGameData = tempGameDataArray[0].split(',');
        var dsGameData = tempGameDataArray[1].split(',');
        console.log(beGameData.join(' / '));
        console.log(dsGameData.join(' / '));

        var map = beGameData[0];
        map = map.replace(/([A-Z])/g, ' $1').trim();
        var beScore = beGameData[1];
        var dsScore = dsGameData[1];
        

        if(!isNaN(beScore) && !isNaN(dsScore)){
            if(typeof beGameData[8] != 'undefined' && typeof dsGameData[8] != 'undefined'){
                //Add Maps
                var mapID = await insertMap(map);
                console.log(mapID);
                //GameStats
                var gameID = await insertGameStats(mapID);
                console.log(gameID);
                //Game Info
                await insertGameData(gameID,0,beScore);
                await insertGameData(gameID,1,dsScore);
                //Add Players
                for(var i = 0; i < 7; i++){
                    var inserts = beGameData[i + 2];
                    var bePlayerID = await insertPlayerData(inserts);
                    await insertGamePlayerInfo(gameID, 0, bePlayerID);

                    inserts = dsGameData[i + 2];
                    var dsPlayerID = await insertPlayerData(inserts);
                    await insertGamePlayerInfo(gameID, 1, dsPlayerID);
                }
                var winner;
                beScore>dsScore? winner = "Blood Eagle":"Diamond Sword";

                //respond
                message.reply("Map: " + map + 
                    "\nWinnder: " + winner  + 
                    "\nBlood Eagle Score: " + beScore  + 
                    "\nDiamond Sword Score: " + dsScore + 
                    "\nBlood Ealge Players: " + beGameData[2] + ", "+ beGameData[3] + ", "+ beGameData[4] + ", "+ beGameData[5] + ", "+ beGameData[6] + ", "+ beGameData[7] + ", "+ beGameData[8] +
                    "\nDiamond Sword Players: " + dsGameData[2] + ", "+ dsGameData[3] + ", "+ dsGameData[4] + ", "+ dsGameData[5] + ", "+ dsGameData[6] + ", "+ dsGameData[7] + ", "+ dsGameData[8]);
            }else{
                message.reply("Error: Not enough game data. Check if both teams have 7 players. Format should be: " + 
                "\nTrCTF-ArxNovena,6,indi,myster1on,sanics,superflewis,aps2,snowierfudge,dodge" + 
                "\nTrCTF-ArxNovena,4,mcoot,greenishmilk,wandlimb,rogopotato,seldom,souppot,bepo");
            }
        }
        else{
            message.reply("Error: Score is not a number. Format should be: " + 
            "\nTrCTF-ArxNovena,6,indi,myster1on,sanics,superflewis,aps2,snowierfudge,dodge" + 
            "\nTrCTF-ArxNovena,4,mcoot,greenishmilk,wandlimb,rogopotato,seldom,souppot,bepo");
        }
        
        await sql.close();
    }
}

module.exports = InsertGameCommand;