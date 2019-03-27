const extend = require("extend");

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


//Import commands from folder
require("fs").readdirSync("./commands").forEach( file => {
    //if (file.splice(-2) != "js") return;
    console.log("Importing command: " + file);
    extend(false, commands, require("./commands/" + file));
});