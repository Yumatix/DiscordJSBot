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

//When bot connects to Discord's servers
client.on("ready", () => {
    console.log(`Bot initiated. Type '?' for command line commands, or type ${config.command_symbol}help in discord for bot commands.`);

    if (config.owner_id != "" && config.greet_owner)
        setTimeout(() => {
            client.fetchUser(config.owner_id).then(user => {
                user.sendMessage(`Greetings, ${user.username}! I'm Ciel, your new bot for Discord! From here, you can configure me and manage things like user permissions without digging through files!`);
            });
        }, 3000);

});

//When client detects a message
client.on("message", (message) => {
    //PMs from owner
    if (message.guild == null && message.author.id == config.owner_id){
        console.log("RECIEVED DM FROM OWNER");
        message.author.sendMessage("<Generic owner response>");
        return;
    }

    //Guild messages
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

client.on("guildCreate", (guild) => {
    //playNewServerMessage(guild);
});

//When a command is passed via CLI
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

// -- INIT -- 

//Load keys from file, generate keys file if non-existant
try {
    if (fs.existsSync("./keys.json")){ loadKeys(); }
    else throw error;
} catch (err) {
    console.log("\"keys.json\" file missing! Regenerating. ");
    fs.writeFileSync("./keys.json", `{\n    "bot_token" : "",\n    "google_api_key" : ""\n}`);
}

//Check for bot token, provide prompt if missing, shutdown bot.
if (!config.bot_token || config.bot_token == ""){
    console.log("ERROR: Bot token missing. Please add your bot token to keys.json. For more information, check out the CielBot documentation.\nREMINDER: Keep your bot token secret at all times! Never give it to anyone, or they will have access to your bot!");
    client.destroy();
    process.exit();
}

//Connect to Discord servers
console.log(`Initiating bot..\nCommand Prefix: ${config.command_symbol}`);
client.login(config.bot_token);


function loadKeys(){
    extend(false, global.config, JSON.parse(fs.readFileSync("./keys.json")));
}

//Plays when the bot joins a new server for the first time
//NOTE -- CURRENTLY DISABLED DUE TO BUGS
function playNewServerMessage(guild){

    var ownerName = "";
    var embed = {};
    client.fetchUser(config.owner_id).then(user => {

        ownerName = user.username;
        
        embed.color = 0x7936ca;
        embed.footer = {"text":`CielBot ${config.version}`};
        embed.fields = [
            {"name":"Greetings!", 
            "value":`Hi, ${guild.name}! I'm Ciel, a bot for Discord with plenty of features and abilites. If you'd like to learn more about what I can do, type \`/help\` into the chat at any time. If you'd like to learn about me and my creator, feel free to type \`/info\`! By the way, \`${ownerName}\` is in charge of me! My code is publicly available on Github if you'd like to be in charge of your very own copy of me.`},
            {"name": "Note:", 
            "value":`At this time, I'm still in alpha stage development. Many planned features aren't yet available. As of now, I'm able to function as a basic music bot. I can stream music from Youtube when given either a link or a search term. But my creator has lots more planned for my future! Keep an eye out, I'll let you know if I'm ever updated by \`${ownerName}\`.`},
            {"name":"~~Dear server owner,~~ *Still under development... sorry.*", 
            "value":`~~I come with some configurability options available to you, to help customize how I work in your server! Want to restrict my messages to a specific channel? Want me to automatically delete or keep certain messages? Need a few server management utilites to help keep things smooth? Type \`/config\` in any text channel on your server, and I'll send you a DM so we can set things up! During setup, you can even set other members or roles who can also manage me.~~`}
        ];
        

        guild.channels.sort((c1, c2) => {
            if(c1.type!==`text`) return 1;
            if(!c1.permissionsFor(guild.me).has(`SEND_MESSAGES`)) return -1;
            return c1.position < c2.position ? -1 : 1;
        }).first().send({embed: embed});
    });

}

