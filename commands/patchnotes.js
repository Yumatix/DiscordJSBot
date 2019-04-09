
module.exports.patchnotes = function(args){
    var client = args[0];
    var message = args[1];

    var fields;

    global.dataManager.checkPatchNotes(config.version).then(patchNotes => {
        fields = patchNotes;
        
        let embed = {
            title: "Latest Patch Notes",
            color: 0x7936ca,
            fields: fields,
            footer: `CielBot ${config.version}`
        }

        
        message.channel.send({embed: embed})
        .then(message => {messageManager.addResponseMessage(message)});
    })


};

module.exports.patchnotes.syntax = "patchnotes"; 
module.exports.patchnotes.description = "Prints out the most recent patch notes for the current version of CielBot"; 