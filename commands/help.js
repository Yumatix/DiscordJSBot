module.exports.help = function(args){
    var client = args[0];
    var message = args[1];

    //Show help for specific command
    if (args.length == 3){
        var c = args[2];
        if(commands[c].cliOnly) return;
        if (!commands[c].syntax || !commands[c].description) {console.log(`WARN: Command "${c}" is missing either syntax or descriptor information!`); return;} 
        var reply = {fields: [{name: client.getGuildCommandPrefix(message.guild.id) + commands[c].syntax, value: commands[c].description}]};
        message.channel.send({embed: reply}).then(message => messageManager.addResponseMessage(message));
    }
    else {
        sortedKeys = Object.keys(commands);
        sortedKeys.sort();

        //Assemble embed fields
        var fields = [];
        sortedKeys.forEach(key => {
            if (commands[key].cliOnly) return;
            if(!commands[key].syntax || !commands[key].description) {console.log(`WARN: Command "${key}" is missing either syntax or descriptor information!`); return;}
            var field = {name: client.getGuildCommandPrefix(message.guild.id) + commands[key].syntax, value: commands[key].description};
            fields.push(field);
        });
        message.channel.send({embed: {color: 0x7936ca, fields: fields}}).then(message => messageManager.addResponseMessage(message));
    }
};
module.exports.help.syntax = "help <command>";
module.exports.help.description = "Prints help for a specific command, or prints all commands, if not specified.";