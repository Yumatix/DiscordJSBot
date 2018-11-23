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
}
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
}
commands.help.syntax = "help <command>";
commands.help.description = "Prints help for a specific command, or prints all commands, if not specified.";