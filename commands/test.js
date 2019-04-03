//args is auto-passed by the program. 
//args[0] is always a reference to the bot client
//args[1] is always a reference to the discord message that triggered the command
//Any other args can be command specific
//NOTE: CLI commands CANNOT rely on args[1], since these commands can be triggered from the console instead. 

module.exports.test = function(args){
    var message = args[1];
    let c = message.guild.channels.get("517488414904549398");
    c.send("Test!");
};

// -- The following are optional properties --

module.exports.test.syntax = ""; // the syntax for this command (shown when /help is called)
module.exports.test.description = ""; // Description for the command during /help