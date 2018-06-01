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
    this.channels = client.channels;
  }
  
  run(message){
    var channel = bot.channels.get("Pug Org", "Quiet Puggos", "Fat Kids", "Fat Kids(Quiet)").id;

    var rule = new schedule.RecurrenceRule();
    rule.minute = 0;
    rule.hour = [14, 19, 20];

    var j = schedule.scheduleJob(rule, function() {
        bot.channels.get("id", channel).sendMessage("Testing");
    })

    console.log("Bot is ready.");

    var chan = this.client.channels['413598358738042895'];
    var mems = chan.members;
    console.log(mems.size);
    for (var x in mems) {
      console.log(x.userID);
    }
    //var mems = chan.members;
    //for(var x in mems){
    //  console.log.x.GuildMember.id;
    //}
  }
}
module.exports = CaptainsRollCommand;