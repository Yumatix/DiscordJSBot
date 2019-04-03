module.exports.info = function(args){
    var message = args[1];

    let desc = "**Hello! My name is Ciel. I'm just another variation of the common music bot for Discord. Hopefully some of my features are useful to you!\n\n";
    desc += `Type ${config.command_symbol}help to see what I can do.\n\n`;
    desc += "Check out my author on [Github](https://www.github.com/users/Kristinosis)!**";

    let embed = {
        "description" : desc,
        "color" : 0x7936ca,
        "footer": {
            "text": `CielBot ${config.version}`
          }
    };

    message.channel.send({embed:embed});
}
module.exports.info.syntax = "info";
module.exports.info.description = "Information about CielBot";