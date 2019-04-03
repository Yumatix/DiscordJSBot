
//BIG TODO: Clean this up and make it work a lot better. Stop hardcoding so much. Etc. 

//Script used when a server owner uses the setup command
const fs = require("fs");

module.exports = class ServerSetup{
    constructor(client, guildID, ownerID){
            this.client = client; //reference to the bot client
            this.ownerID = ownerID;
            
            this.channels = [] //Holder for when we're searching channels

            //Value = the currently stored value
            //parse = a function that potential new values need to be tested against before updating 'value'
            this.configuration = [
                {value: null, parser: function(val){ return true; }}, //command prefix
                {value: null, parser: function(val){ return true; }}, //default channel
                {value: null, parser: function(val){ return true; }}
            ];

            this.stage = 0;
            this.guild = this.client.guilds.get(guildID);
    }

    go(){
        this.client.fetchUser(this.ownerID).then((user) => {
            this.user = user;
            this.start();
        });
    }

    start(){
        let strA = `Hi! I'm Ciel. Let's get your server, ${this.guild.name}, up and running, shall we? (Please note, if you've ran this config command before, this will completely overwrite previous changes!)`;
        let strB = `To start, let's decide what your server's **command prefix** will be. This is the character(s) that will appear before any commands inputted by users, to help me know when to listen. So, if you want people to type in '/help' for me to show them my help page, you should set your command prefix to '/'. My host has set my default prefix to be ${config.default_command_prefix}, so feel free to use that if you like! I *strongly* recommend single symbols, such as '/', '?', '!', '-', etc., but it's entirely up to you what to use!`;
        let strC = `Alright! So, what would you like your prefix to be? (Just respond to this message with your answer. Don't worry if you make a mistake, we'll go over everything first before I save any changes!)`;
        
        this.client.fetchUser(this.ownerID)
        .then((user) => this.user.send(strA))
        .then(() => this.user.send(strB))
        .then(() => this.user.send(strC));

        console.log(`${this.user.name} (${this.user.id}) started guild configuration for the guild ${this.guild.name} (${this.guild.id})`);
        console.log(guildPrefs[this.guild.id]);
    }

    next(){
        switch(this.stage++){
            //Set up default channel
            case 0:
                let strA = `Okay, great! Now let's set up your **default channel**. Normally when I talk, I wait for someone to give me a command. That way, I know which text channel to send my response. But occasionally, I need to say something without being given a command first! This doesn't happen often, but I need to know where you'd like me to send these messages. Ideally, it should be a 'general' or 'default' channel, or somewhere that everyone on your server has public access to. `;
                let strB = `Let me just search your server for channels...`;
                
                this.user.send(strA)
                .then(() => this.user.send(strB))
                .then(() => {
                    this.channels = [];
                    let i = 1;
                    let strC = `Okay! I found these text channels on your server: `
                    this.guild.channels.forEach(c => {
                        if (c.type == "text"){
                            this.channels.push({name:c.name, id:c.id});
                            strC += `\n   ${i}. ${c.name}\n`;
                            i++;
                        }
                    });

                    this.user.send(strC + `\nWhich one would you like to use? (Answer with the number beside the channel you want).`);
                });
                break;
            //Ask for confirmation
            case 1:
                //By this point.. the defaultChannel value has been set to a number. Let's find the right channel id for that number.
                
                let val = this.configuration[1].value-1;
                this.configuration[1].value = this.channels[val].id;


                //And now let's confirm all this stuff that we changed!
                let strD = `Okay! Let's recap.`;
                let strE = ` - You chose ${this.configuration[0].value} as your command prefix.`;
                let strF = ` - You chose ${this.channels[val].name} as your default channel.`;
                let strG = `Does that all look good? ('y' for yes, 'n' for no)`;

                this.user.send(strD)
                .then(() => this.user.send(strE))
                .then(() => this.user.send(strF))
                .then(() => this.user.send(strG));
                break;
            case 2: 
                
                if (this.configuration[2].value == 'y') {
                    this.saveConfig();
                } else {
                    this.user.send("That's okay! I won't save the changes. Re-run the setup command to try again!");
                }
                break;
        };
    }
    
    messageRecieved(message){
        if (this.configuration[this.stage].parser(message)){
            this.configuration[this.stage].value = message;
            this.next();
        } else {
            this.user.send("Sorry, I couldn't quite understand that. Please try again?");
        }
    }

    saveConfig(){
        guildPrefs[this.guild.id].command_prefix = this.configuration[0].value;
        guildPrefs[this.guild.id].default_channel = this.configuration[1].value;

        this.user.send("Okay! I saved your settings. Thanks for running setup!");
        this.guild.channels.get(this.configuration[1].value).send(`My command prefix has been updated. From now on, please put '${this.configuration[0].value}' in front of any commands! To see what I can do, type ${this.configuration[0].value}help.`);

        console.log(guildPrefs[this.guild.id]);
        console.log(`Guild configuration finished for ${this.guild.name} (${this.guild.id}). Saving changes to file.`);
        
        fs.writeFileSync("./guildPrefs.json", JSON.stringify(guildPrefs));
    }

}