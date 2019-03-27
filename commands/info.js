module.exports.info = function(args){
    var message = args[1];

    let embed = {
        "title" : `Hello! My name is Ciel. I'm just another variation of the common music bot for Discord. Hopefully some of my features are useful to you! 
\nType ${config.command_symbol}help to see what I can do.
\nCheck out my author on [Github](https://www.github.com/users/Kristinosis)!`,
        "color" : 0x13b8e1,
        "footer": {
            "text": `CielBot ${config.version}`
          }
    };

    message.channel.send({embed:embed});
}
module.exports.info.syntax = "info";
module.exports.info.description = "Information about CielBot";