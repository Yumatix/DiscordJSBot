const MongoClient = require("mongodb").MongoClient;

module.exports = class DataManager{
    constructor(db_uri, db_name, usingDatabase, cache_rate){
        this.db_uri = db_uri;
        this.db_name = db_name;
        this.usingDatabase = usingDatabase //Assume this is true for now
        this.cache_rate = cache_rate;
        this.GuildPrefs = {};
        this.db;

        var client = new MongoClient(this.db_uri);
        client.connect((err) => {
            if (err) console.log(`Error connecting to Database: ${err}`);

            this.db = client.db(this.db_name);

            //Why can't 'this' just mean 'this instance of the object' D: (I wish js had real classes and not just ES6)
            var _this = this; 
            this.refreshCache(this);
            setInterval(function(){_this.refreshCache(_this)}, this.cache_rate);
        });
    }

    refreshCache(_this){
        var cursor = _this.db.collection("Guilds").find();
        console.log("Fetching guild preference cache from server...");
        _this.GuildPrefs = {};
        cursor.forEach((doc) => {
            var obj = {};
            Object.keys(doc).forEach(k => {
                if (k != "guild_id") { obj[k] = doc[k]; }
            });
            _this.GuildPrefs[doc.guild_id] = obj;
        }).then(() => console.log("Done fetching guild preferences."));
    }

    updateGuildPrefs(guild_id, prefs){
        //Update locally
        var _this = this;
        Object.keys(prefs).forEach(k => {_this.GuildPrefs[guild_id][k] = prefs[k]});

        console.log("Updating guild preferences for guild " + guild_id);
        //Push updates to remote
        prefs.guild_id = guild_id;
        this.db.collection("Guilds").replaceOne({guild_id: guild_id}, prefs, {upsert: true});
    }

    checkPatchNotes(currentVersion){
        //Create promise
        return new Promise((resolve, reject) => {
            console.log("Checking patch notes...");
            currentVersion = currentVersion.split(".");
            var patchNotes = [];
            var cursor = this.db.collection("Versions").find();
            
            //Iterate over each document in the versions collection
            cursor.forEach(doc => {
                let version = doc.number.split(".");
                if (version[1] == currentVersion[1] && version[0] == currentVersion[0]){
                    let versionNotes = {};
                    versionNotes.name = doc.number;

                    let versionNotesFields = "";
                    doc.notes.forEach(note => {
                        versionNotesFields += ` - ${note}\n`;
                    });
                    versionNotes.value = versionNotesFields;

                    patchNotes.push(versionNotes);
                }
            })
            
            .then(() => {
                resolve(patchNotes);
            });

            
        })
    }
}