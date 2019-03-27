module.exports.queue = function(args){
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
module.exports.queue.syntax = "queue";
module.exports.queue.description = "Check the music queue for this server";