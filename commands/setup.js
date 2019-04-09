//args is auto-passed by the program. 
//args[0] is always a reference to the bot client
//args[1] is always a reference to the discord message that triggered the command
//Any other args can be command specific
//NOTE: CLI commands CANNOT rely on args[1], since these commands can be triggered from the console instead. 

const SetupScript = require("../setupScript.js");

module.exports.setup = function(args){
    var client = args[0];
    var message = args[1];

    if (message.author.id != message.guild.owner.id){
        message.channel.send("You're not the owner of this server! I can't run the setup script with you. Sorry!")
        .then(message => messageManager.addResponseMessage(message));
        return;
    }

    message.guild.setupScript = new SetupScript(client, message.guild.id, message.guild.owner.id);
    message.guild.setupScript.go();
};

module.exports.setup.syntax = "setup"; // the syntax for this command (shown when /help is called)
module.exports.setup.description = "Initiate server setup in DMs. (Only works for server owners. Warning! This will stop any server setup scripts already running in your DMs. If you own more than one server and are using me on both, make sure you finish config for one server before starting config for the other!)";