module.exports.playing = function(args){
    var message = args[1];

    if (!message.guild.queue) console.log("Nothing is playing!");
    else {
        let current = message.guild.queue.getCurrentSong();
        message.guild.fetchMember(current.requester).then(member => {
            let reply = `Currently playing in ${message.guild.voiceConnection.channel.name}: ${current.title}
Requested by: ${member.nickname || member.user.username}\n\n${current.url}`;
            message.channel.send(reply).then(message => messageManager.addResponseMessage(message));
        });
    }
};
module.exports.playing.syntax = "playing";
module.exports.playing.description = "Get info about currently playing song";