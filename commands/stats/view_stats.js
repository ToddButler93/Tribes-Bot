const commando = require('discord.js-commando');
const sql = require("sqlite");

async function getPlayerID(playerName){
    //TODO CHECK SMURF NAMES

    await sql.get("SELECT * FROM players WHERE playerName = (?)", playerName).then(row => {
        if (!row) {
          console.log("Player doesn't exist.");
          sql.run("INSERT INTO players VALUES (NULL,?)", playerName);
        }else {
            console.log("Player exists.");
        };
      });
    


    var playerName = "";
    await sql.get("SELECT playerName AS name FROM players WHERE playerID = (?)", playerID).then(row => {
        playerName = row.id;
        console.log(playerName);
      });
    return playerName;
}

class ViewStatsCommand extends commando.Command{
    constructor(client){
        super(client, {
            name: 'viewstats',
            group: 'stats',
            memberName: 'viewstats',
            description: 'View Player Stats',
            args: [
                {
                    key: 'playerName',
                    prompt: 'Which player would you like to view stats for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, {playerName}){
        await sql.open("./sql/stats.sqlite");
        message.reply("Dodge is the best player in Australia and all the ladies wish he'd blue plate them.");
        var inserts = playerName;
        //"SELECT * FROM players WHERE playerName = (?)", inserts

        var playerID = await getPlayerID(playerName);

        var winSql = "SELECT player, \
        COUNT(*) AS TotalGames,\
        SUM(CASE WHEN condition='win' THEN 1 ELSE 0 END) AS Wins,\
        COUNT(*)-SUM(CASE WHEN condition='win' THEN 1 ELSE 0 END) AS Losses,\
        SUM(CASE WHEN condition='win' THEN 1 ELSE 0 END)*100/COUNT(*) AS WinPercentage\
        FROM tenis_table\
        GROUP BY player";
        
        sql.close();
    }
}

module.exports = ViewStatsCommand;