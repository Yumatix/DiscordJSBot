module.exports.unsummon = function(args){
    var message = args[1];
    if (!message.guild.voiceConnection) {
        message.channel.send("I'm not in a voice channel!");
        return;
    }

    if(!message.member.voiceChannel || message.guild.voiceConnection.channel != message.member.voiceChannel){
        message.channel.send("You're not in my channel!");
        return;
    }

    message.guild.voiceConnection.disconnect();
}
module.exports.unsummon.syntax = "unsummon";
module.exports.unsummon.description = "Unsummon me from my current voice channel.";