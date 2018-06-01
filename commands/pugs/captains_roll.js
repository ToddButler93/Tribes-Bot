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

    for (let [snowflake, guildMember] of fatKidsMems) {
      console.log('User Added: ' + guildMember.user.username); 
      this.players.push(guildMember.user.username);
      this.playerCount++;
    }
    for (let [snowflake, guildMember] of fatKidsQMems) {
      console.log('User Added: ' + guildMember.user.username); 
      this.players.push(guildMember.user.username);
      this.playerCount++;
    }
    for (let [snowflake, guildMember] of pugOrgMems) {
      console.log('User Added: ' + guildMember.user.username); 
      this.players.push(guildMember.user.username);
      this.playerCount++;
    }
    for (let [snowflake, guildMember] of pugOrgQMems) {
      console.log('User Added: ' + guildMember.user.username); 
      this.players.push(guildMember.user.username);
      this.playerCount++;
    }

    console.log("Player count: " + this.playerCount);
    if(this.playerCount >= 14){
      var captainBE = this.players[Math.floor(Math.random() * this.players.length)];
      var captainDS;
      while(captainDS == captainBE){
        captainDS = this.players[Math.floor(Math.random() * this.players.length)];
      }

      message.reply("Captain Blood Eagle: " + captainBE, "Captain Diamond Sword: " + captainDS);
    }else{
      message.reply("Not enough players for pug.");
    }
  }
}
module.exports = CaptainsRollCommand;