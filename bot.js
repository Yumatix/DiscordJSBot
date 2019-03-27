//Import required dependancies
const fs = require("fs");
const extend = require("extend");
const readline = require("readline").createInterface({input:process.stdin,output:process.stdout});
const Discord = require("discord.js");
require("./commands.js");

//Load JSON config files
global.config = JSON.parse(fs.readFileSync("./config.json")); //require("./config_internal.js");
extend(false, global.config, JSON.parse(fs.readFileSync("package.json")));

//Initiate bot
const client = new Discord.Client();
client.queues = [];

client.on("ready", () => {
    console.log(`Bot initiated. Type '?' for command line commands, or type ${config.command_symbol}help in discord for bot commands.`);

    if (config.owner_id != "" && config.greet_owner)
        setTimeout(() => {
            client.fetchUser(config.owner_id).then(user => {
                user.sendMessage(`Greetings, ${user.username}! I'm Ciel, your new bot for Discord! From here, you can configure me and manage things like user permissions without digging through files!`);
            });
        }, 3000);

});

client.on("message", (message) => {
    if (message.guild == null && message.author.id == config.owner_id){
        console.log("RECIEVED DM FROM OWNER");
        message.author.sendMessage("<Generic owner response>");
        return;
    }

    if (message.content.substring(0,1) == config.command_symbol){
        var substrings = message.content.split(" ");
        var command = substrings[0].substring(1);
        var args = substrings;
        if(commands[command] && commands[command].cliOnly) return;
        args.splice(0,1);
        console.log(`Recieved command: ${command} from author ${message.author}(${message.author.username}) with args: ${args}`);
        args.unshift(client, message);
        if(commands[command]) commands[command](args);
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

try {
    if (fs.existsSync("./keys.json")){ loadKeys(); }
    else throw error;
} catch (err) {
    console.log("\"keys.json\" file missing! Regenerating. ");
    fs.writeFileSync("./keys.json", `{\n    "bot_token" : "",\n    "google_api_key" : ""\n}`);
}

if (!config.bot_token || config.bot_token == ""){
    console.log("ERROR: Bot token missing. Please add your bot token to keys.json. For more information, check out the CielBot documentation.\nREMINDER: Keep your bot token secret at all times! Never give it to anyone, or they will have access to your bot!");
    client.destroy();
    process.exit();
}

console.log(`Initiating bot..\nCommand Prefix: ${config.command_symbol}`);
client.login(config.bot_token);


function loadKeys(){
    extend(false, global.config, JSON.parse(fs.readFileSync("./keys.json")));
}


