//Import required dependancies
const fs = require("fs");
const readline = require("readline").createInterface({input:process.stdin,output:process.stdout});
const Discord = require("discord.js");
require("./commands.js");

//Load JSON config files
global.config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

//Initiate bot
const client = new Discord.Client();


client.on("ready", () => {
    console.log(`Bot initiated. Type '?' for command line commands, or type ${config.command_symbol}help in discord for bot commands.`);
});

client.on("message", (message) => {
    if (message.content.substring(0,1) == config.command_symbol){
        var substrings = message.content.split(" ");
        var command = substrings[0].substring(1);
        var args = substrings;
        args.splice(0,1);
        console.log(`Recieved command: ${command} from author ${message.author}(${message.author.username}) with args: ${args}`);
        args.unshift(client, message);
        commands[command](args);
    }
});


readline.on("line", (line) => {
    var substrings = line.split(" ");
    var command = substrings[0];
    var args = substrings;
    args.splice(0,1);
    args.unshift(client, null);

    if (command == "?"){
        var helpString = "";
        var sortedKeys = Object.keys(commands);
        sortedKeys.sort();
        sortedKeys.forEach(key => {
            if (commands[key].cli){
                helpString += commands[key].syntax + " - " + commands[key].description + "\n"; 
            }
        });
        console.log(helpString);
    }
    else if (commands[command] && commands[command].cli) commands[command](args);
    else console.log(`Unknown console command: ${command}`);
});
console.log(`Initiating bot..\nCommand Prefix: ${config.command_symbol}`);
client.login(config.bot_token);





