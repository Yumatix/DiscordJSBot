module.exports = commands = {};

//All commands are added to the commands object like so:
//commands.COMMAND_NAME = function(args){};
//"args" is an array of arguments.. unpack them inside the function.
//"args[0]" is always a reference to the bot client
//"args[1]" is always a reference to the message that triggered the command
//Add a "description" variable to add a description to the command
//Add a "syntax" variable to add a description of the command and its arguments
//Add a "cli" variable (and set to true) to allow the command to be run from cli
//MAKE SURE ANY CLI COMMANDS \\DON'T\\ USE ARGS[1]
//(Exclude the command prefix from the "syntax" variable... it will be loaded in from the config file)
//"description" and "syntax" are mainly used during the "help" command to output each command


//SHUTDOWN
commands.shutdown = function(args){
    var client = args[0];
    var message = args[1];
    console.log("Shutting down bot...");
    if (message) {message.channel.send("Shutting down... goodbye! :wave:");}
    client.destroy();
    process.exit();
};
commands.shutdown.syntax = "shutdown";
commands.shutdown.description = "Closes all connections and shuts down the bot completely.";
commands.shutdown.cli = true;

//PING
commands.ping = function(args){
    var message = args[1];
    message.channel.send("Pong!");
};
commands.ping.syntax = "ping";
commands.ping.description = "Pings the bot.";

//HELP
commands.help = function(args){
    var message = args[1];

    //Show help for specific command
    if (args.length == 3){
        var c = args[2];
        var reply = {fields: [{name: config.command_symbol + commands[c].syntax, value: commands[c].description}]};
        message.channel.send({embed: reply});
    }
    else {
        sortedKeys = Object.keys(commands);
        sortedKeys.sort();

        //Assemble embed fields
        var fields = [];
        sortedKeys.forEach(key => {
            var field = {name: config.command_symbol + commands[key].syntax, value: commands[key].description}
            fields.push(field);
        });

        message.channel.send({embed: {fields: fields}});
    }
};
commands.help.syntax = "help <command>";
commands.help.description = "Prints help for a specific command, or prints all commands, if not specified.";



//SUMMON
commands.summon = function(args){
    var message = args[1];
    if (!message.guild) message.channel.send("Sorry, I can only join servers!");
    if (message.member.voiceChannel){
        message.member.voiceChannel.join().then(connection => {
            console.log(`Summoned by ${message.author}(${message.author.name}) to channel ${connection.channel}(${connection.channel.name}) on guild ${connection.channel.guild}(${connection.channel.guild.name})`);
            });
    }
};
commands.summon.syntax = "summon";
commands.summon.description = "Summon the bot to your voice channel.";

//SUMMONTO
commands.summonto = function(args){
    var message = args[1];
    if (args.length >= 3) {
        var channelName = args[2];
        if (channelToJoin = message.channel.guild.channels.find(channel => channel.name === channelName)){
            channelToJoin.join().then(connection => {
                console.log(`Summoned by ${message.author}(${message.author.name}) to channel ${connection.channel}(${connection.channel.name}) on guild ${connection.channel.guild}(${connection.channel.guild.name})`);
            });
        } else {
            message.channel.send(`Voice channel "${channelName}" not found on this server.`);
        }
    }
    else {
        message.channel.send("You must specify a channel to join!");
    }
};
commands.summonto.syntax = "summonto <channel_name>";
commands.summonto.description = "Summon the bot to a specific channel on the same server";


//PLAY
commands.play = function(args){
    var client = args[0];
    var message = args[1];
    if (args.length >= 3){
        var url = args[2];
        var localVoiceConnection;
        client.voiceConnections.forEach(voiceConnection => {
            if (voiceConnection.channel.guild == message.channel.guild){
                localVoiceConnection = voiceConnection;
            }
        });
        if (localVoiceConnection){
            localVoiceConnection.playArbitraryInput(url);
            console.log(`Now playing: ${url}`);
        }
        else {
            message.channel.send("I am not in a voice channel! Summon me to one first.");
        }
    }
    else {
        message.channel.send("You need to provide me with a URL to play!");
    }
};
