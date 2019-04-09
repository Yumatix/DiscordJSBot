module.exports.queue = function(args){
    var message = args[1];

    //If the bot isn't in a voice channel, cancel.
    if (!message.guild.voiceConnection) {return;}

    if (message.guild.queue.queue.length > 0) {

        let songlist = "";

        message.guild.queue.queue.forEach(song => {
            songlist += `${song.title}\n`;
        });

        let embed = {
            "title" : `Queue for ${message.guild.voiceConnection.channel.name}`,
            "description" : songlist
        }

        message.channel.send({embed: embed}).then(message => messageManager.addResponseMessage(message));

    } else {
        message.channel.send("Queue empty.").then(message => messageManager.addResponseMessage(message));
    }
}
module.exports.queue.syntax = "queue";
module.exports.queue.description = "Check the music queue for this server";