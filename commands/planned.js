//args is auto-passed by the program. 
//args[0] is always a reference to the bot client
//args[1] is always a reference to the discord message that triggered the command
//Any other args can be command specific
//NOTE: CLI commands CANNOT rely on args[1], since these commands can be triggered from the console instead. 


//Prints planned features. (Embedded in code right now, may pull from JSON file or maybe my web API at some point.. idk yet.)
module.exports.planned = function(args){
    var message = args[1];

    let embed = {
        title: "A list of planned features for future updates!",
        description: "If you have any suggestions, feel free to contact my [creator](https://www.github.com/users/Kristinosis)!",
        color: 0x7936ca,
        fields: [{
            "name":"Search Command",
            "value":"Command to search Youtube for songs, returning selectable results. (At the moment, the YT command auto plays the first result, which may not be what you're trying to play. This command is the solution.)"
        },{
            "name":"Music Downloads",
            "value":"At the moment, music is streamed directly. In the future, options will be available to either stream music, or download the song as files before playing, to reduce lag/interference."
        },{
            "name":"Moderation Assistance",
            "value":"Helpful commands to help server owners moderate their servers. Things like kick/ban commands, channel management commands, and more."
        }],
        "footer": {
            "text": `CielBot ${config.version}`
        }
    };

    message.channel.send({embed: embed});
};

module.exports.planned.syntax = "planned"; 
module.exports.planned.description = "Prints a list of planned features for future updates. (This is not a definitive list and can change anytime.)";
