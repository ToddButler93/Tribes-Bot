const commando = require('discord.js-commando');
const sql = require("sqlite");



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
        this.playerName;
        this.playerID;
        this.totalGames;
        this.gamesArray = [];
        this.gamesWonArray = [];
        this.gamesLostArray = [];
        this.wins;
        this.losses;
        this.winPercentage = [];
        this.currentRank;
    }
    
    run(message, {gameData}){
        message.reply("Dodge is the best player in Australia and all the ladies wish he'd blue plate them.");
        return sql.open("./sql/stats.sqlite").then(() => {
            return this.getPlayerID(gameData);
        })
        .then(() => {
            if(this.playerID != -1){
                //return calculateWinPercentage();
            }
        })
        .then(() => {
/*
            return Promise.all([
                message.reply(this.playerName +
                  "\nWin Percentage: " + this.winPercentage[2]  +
                  "\nBlood Eagle Percentage: " + this.winPercentage[0]  +
                  "\nDiamond Sword Percentage: " + this.winPercentage[1]  +
                  "\nCurrent Rank: " + this.currentRank
                ),
                sql.close()
              ]);
*/
        });

    }

    getPlayerID(gameData) {
        this.playerID = 0;
        return sql.get("SELECT playerID AS id FROM players WHERE playerName = (?)", gameData).then(row => {
            if(!row){
                this.playerID = -1;
                this.playerName = "";
                return this;
            }else{
                this.playerID = row.id;
                this.playerName = gameData;
                return this;
            }
        });
      }

      calculateWinPercentage(){
        //TODO actually learn how to write sql, this isn't even close to working.
        var winRateSql = "SELECT gamePlayerTeam.gameID, gamePlayerTeam.playerID, gamePlayerTeam.teamID, gameScore.score\
        FROM ((gamePlayerTeam\
        INNER JOIN gamePlayerTeam ON gamePlayerTeam.playerID = (?))\
        INNER JOIN gameScore ON gamePlayerTeam.gameID = gameScore.gameID)\
        WHERE gamePlayerTeam.playerID = (?);";
        
        return sql.get(winRateSql,playerID).then(row => {
            if(!row){
            }else{
                this.totalGames = row.TotalGames;
                this.wins = row.Wins;
                this.losses = row.losses;
                this.winPercentage.push(row.WinPercentage);
                this.winPercentage.push(row.WinPercentageBE);
                this.winPercentage.push(row.WinPercentageDS);
                return this;
            }
        });
      }
}
module.exports = ViewStatsCommand;

