const MusicQueue = require("./musicQueue.js");
require('./utils.js');

module.exports = commands = {};

//All commands are added to the commands object like so:
//commands.COMMAND_NAME = function(args){};
//"args" is an array of arguments.. unpack them inside the function.
//"args[0]" is always a reference to the bot client
//"args[1]" is always a reference to the message that triggered the command
//Add a "description" variable to add a description to the command
//Add a "syntax" variable to add a description of the command and its arguments
//Add a "cli" variable (and set to true) to allow the command to be run from cli
//Add a "cliOnly" variable (and set to true) to prevent command from being run in discord
//MAKE SURE ANY CLI COMMANDS \\DON'T\\ USE ARGS[1]
//(Exclude the command prefix from the "syntax" variable... it will be loaded in from the config file)
//"description" and "syntax" are mainly used during the "help" command to output each command


//SHUTDOWN
commands.shutdown = function(args){
    var client = args[0];
    var message = args[1];
    console.log("Shutting down bot...");
    if (message) {message.channel.send("Shutting down... goodbye! :wave:").then(function(){
        utils.cleanFiles();
        client.destroy();
        process.exit();
    })}
    else {
        utils.cleanFiles();
        client.destroy(); 
        process.exit();
    }
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
        if(commands[c].cliOnly) return;
        if (!commands[c].syntax || !commands[c].description) {console.log(`WARN: Command "${c}" is missing either syntax or descriptor information!`); return;}; 
        var reply = {fields: [{name: config.command_symbol + commands[c].syntax, value: commands[c].description}]};
        message.channel.send({embed: reply});
    }
    else {
        sortedKeys = Object.keys(commands);
        sortedKeys.sort();

        //Assemble embed fields
        var fields = [];
        sortedKeys.forEach(key => {
            if (commands[key].cliOnly) return;
            if(!commands[key].syntax || !commands[key].description) {console.log(`WARN: Command "${key}" is missing either syntax or descriptor information!`); return;};
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
            console.log(`Summoned by ${message.author}(${message.author.username}) to channel ${connection.channel}(${connection.channel.name}) on guild ${connection.channel.guild}(${connection.channel.guild.name})`);
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
                console.log(`Summoned by ${message.author}(${message.author.username}) to channel ${connection.channel}(${connection.channel.name}) on guild ${connection.channel.guild}(${connection.channel.guild.name})`);
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

//UNSUMMON
commands.unsummon = function(args){
    var message = args[1];
    if (!message.guild.voiceConnection) {
        message.channel.send("I'm not in a voice channel!");
        return;
    }

    if(!message.member.voiceChannel || message.guild.voiceConnection.channel != message.member.voiceChannel){
        message.channel.send("You're not in my channel!");
        return;
    }

    message.guild.voiceConnection.disconnect();
}
commands.unsummon.syntax = "unsummon";
commands.unsummon.description = "Unsummon me from my current voice channel.";

//PLAY
commands.play = function(args){
    var message = args[1];
    var url = args[2];

    //If the bot isn't in a voice channel, cancel.
    if (!message.guild.voiceConnection) {
        message.channel.send("I'm not in a voice channel!");
        return;
    }

    //If the message author isn't in the same voice channel as the client, reject the request.
    if (!message.member.voiceChannel || message.member.voiceChannel != message.guild.voiceConnection.channel){
        message.channel.send("You're not in my voice channel, I can't accept that!");
        return;
    }

    //Create a new queue for this guild, if it doesn't have one
    if (!message.guild.queue) message.guild.queue = new MusicQueue(message.guild);

    message.guild.queue.add(url, message.author.id);
}
commands.play.syntax = "play <url>";
commands.play.description = "Add a song to the music queue";

//PLAYING
commands.playing = function(args){
    var message = args[1];

    if (!message.guild.queue) console.log("Nothing is playing!");
    else {
        let current = message.guild.queue.getCurrentSong();
        message.guild.fetchMember(current.requester).then(member => {
            let reply = `Currently playing in ${message.guild.voiceConnection.channel.name}: ${current.title}
Requested by: ${member.nickname || member.user.username}\n\n${current.url}`;
            message.channel.send(reply);
        })
    }
}
commands.playing.syntax = "playing";
commands.playing.description = "Get info about currently playing song";

//SKIP
commands.skip = function(args){
    var message = args[1];

    //If the bot isn't in a voice channel, cancel.
    if (!message.guild.voiceConnection || (message.guild.queue && message.guild.queue.getCurrentSong() == null)) {
        message.channel.send("I'm not playing anything!");
        return;
    }

    //If the message author isn't in the same voice channel as the client, reject the request.
    if (!message.member.voiceChannel || message.member.voiceChannel != message.guild.voiceConnection.channel){
        message.channel.send("You're not in my voice channel, I can't accept that!");
        return;
    }

    message.guild.queue.skip();
}
commands.skip.syntax = "skip";
commands.skip.description = "Skip the current playing song. (Voting procedures for 'skip' coming soon)";

//QUEUE
commands.queue = function(args){
    var message = args[1];

    //If the bot isn't in a voice channel, cancel.
    if (!message.guild.voiceConnection) {return;}

    //If the message author isn't in the same voice channel as the client, reject the request.
    if (!message.member.voiceChannel || message.member.voiceChannel != message.guild.voiceConnection.channel){
        message.channel.send("You're not in my voice channel, I can't accept that!");
        return;
    }

    if (message.guild.queue.queue.length > 0) {

        let songlist = "";

        message.guild.queue.queue.forEach(song => {
            songlist += `${song.title}\n`;
        });

        let embed = {
            "title" : `Queue for ${message.guild.voiceConnection.channel.name}`,
            "description" : songlist
        }

        message.channel.send({embed: embed});

    } else {
        message.channel.send("Queue empty.");
    }
}
commands.queue.syntax = "queue";
commands.queue.description = "Check the music queue for this server";

commands.info = function(args){
    var message = args[1];

    let embed = {
        "title" : `Hello! My name is Ciel. I'm just another variation of the common music bot for Discord. Hopefully some of my features are useful to you! 
\nType ${config.command_symbol}help to see what I can do.
\nCheck out my author on [Github](https://www.github.com/users/Kristinosis)!`,
        "color" : 0x13b8e1,
        "footer": {
            "text": `CielBot ${config.version} (Released on ${config.release_date})`
          }
    };

    message.channel.send({embed:embed});
}
commands.info.syntax = "info";
commands.info.description = "Information about CielBot";