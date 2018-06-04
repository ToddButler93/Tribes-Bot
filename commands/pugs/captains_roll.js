const commando = require('discord.js-commando');
const sql = require("sqlite");

class CaptainsRollCommand extends commando.Command{
  constructor(client){
    super(client, {
      name: 'captains',
      group: 'stats',
      memberName: 'captains',
      description: 'Roll for captains.'
    });
    this.playerCount;
    this.players = [];
    this.captainBE;
    this.captainDS;
    this.selectionBE;
    this.selectionDS;
  }
  
  run(message){
    var fatKids = this.client.channels.get("435440179554156554");
    var fatKidsQ = this.client.channels.get("435040441197395988");
    var pugOrg = this.client.channels.get("413598358738042895");
    var pugOrgQ = this.client.channels.get("427387468854198273");
    var fatKidsMems = fatKids.members;
    var fatKidsQMems = fatKidsQ.members;
    var pugOrgMems = pugOrg.members;
    var pugOrgQMems = pugOrgQ.members;
    this.playerCount = 0;

    return Promise.all([
      this.getMembers(fatKidsMems),
      this.getMembers(fatKidsQMems),
      this.getMembers(pugOrgMems),
      this.getMembers(pugOrgQMems)
    ]).then(() => {
      console.log("Player count: " + this.playerCount);
      this.selectionBE = Math.floor(Math.random() * (this.players.length));
      this.selectionDS = Math.floor(Math.random() * (this.players.length - 1));
      if(this.selectionDS == this.selectionBE) this.selectionDS++;
    }).then(() => {
      this.captainBE = this.players[this.selectionBE];
      this.captainDS = this.players[this.selectionDS];
    }).then(() => {
      if(this.playerCount >= 1){
        message.channel.send("BE: " + this.captainBE +
        "\nDS: " + this.captainDS);
      }else{
        message.channel.send("Not enough players for pug.");
      }
    });
  }

  getMembers(members){
    for (let [snowflake, guildMember] of members) {
      this.players.push(guildMember.user.username);
      this.playerCount++;
    }
  }
}
module.exports = CaptainsRollCommand;