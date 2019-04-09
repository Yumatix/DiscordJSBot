//Searches Youtube and plays the first result 

const axios = require("axios");
const MusicQueue = require("./../musicQueue.js");

module.exports.yt = function(args){
    var message = args[1];

    //If the bot isn't in a voice channel, cancel.
    if (!message.guild.voiceConnection) {
        message.member.voiceChannel.join();
    }

    //If the message author isn't in the same voice channel as the client, reject the request.
    if (!message.member.voiceChannel || message.member.voiceChannel != message.guild.voiceConnection.channel){
        message.channel.send("You're not in my voice channel, I can't accept that!");
        return;
    }

    //Form the request URL
    args.splice(0,2);
    var query = args.toString();
    var requestURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${query}&key=${config.google_api_key}`;

    //Send GET request
    axios.get(requestURL)
    .then(response => {

        //Parse for video ID
        var videoID = response.data.items[0].id.videoId;
        var url = `https://www.youtube.com/watch?v=${videoID}`;

        //Create a queue in this guild if it doesn't exist, add newly formed url to queue.
        if (!message.guild.queue) message.guild.queue = new MusicQueue(message.guild);
        message.guild.queue.add(url, message.author.id);

    })
    .catch(error => {
        console.log(error);
    });
};

// -- The following are optional properties --

module.exports.yt.syntax = "yt <search term(s)>"; 
module.exports.yt.description = "Searches Youtube and plays the first result (or adds it to the queue...)";
module.exports.yt.cli = false;  
module.exports.yt.cliOnly = false;