const ytdl = require("ytdl-core");

class Song {
    constructor(guild, url, requester, skipRatio){
        this.url = url;
        this.guild = guild;
        this.requester = requester;
        this.skipRatio = skipRatio || config.defaultSongSkipPercentage;
        this.title = "";
        this.filePath = "";
        this.playRequested = false;
        this.status = Song.states.PROCESSING;

        this.dispatcher = false;

        this.process();
    }

    getStatus(){
        return this.status;
    }

    resume(){
        if (this.dispatcher) this.dispatcher.resume();
    }

    //Initialize dispatcher and start song
    start() {
        let stream = ytdl(this.url, {filter: 'audioonly'});
        stream.on("error", (err) => {console.error(err)});

        this.dispatcher = this.guild.voiceConnection.playStream(stream, {seek: 0, volume: 1});
        this.dispatcher.on("end", (reason) => {
            console.log("Song ended. Reason: " + reason)
            this.status = Song.states.DONE;
            this.guild.queue.loadNextSong();
        });
        this.dispatcher.on("error", (err) => {console.error(err)});
    }

    requestStart(){
        this.playRequested = true;
        if (config.streamMusic && this.status == Song.states.READY) this.start();
    }

    //When a song is added: Grab title and filepath. If streaming, set status to READY. If downloading, set status to WAITING
    process(){
        ytdl.getBasicInfo(this.url, (err, info) => {
            if (err) throw err;
            let title = info.title;
            let vidID = info.player_response.videoDetails.videoId;
            console.log(`Found video: ${title}\nID: ${vidID}`);
            this.title = title;
            this.filePath = `./files/${vidID}.mp3`; 

            if (config.stream_music) {
                this.status = Song.states.READY;
                if (this.playRequested) {this.start(); console.log("Playing")};
            }
            else this.status = Song.states.WAITING;
        });
    }

}

Song.states = {
    READY : "Ready", //Ready to play (Processed if streaming, downloaded if downloading)
    PLAYING : "Playing", //Currently playing
    PAUSED : "Paused", //Currently paused
    DONE : "Done", //Finished playing
    DOWNLOADING : "Downloading", //Downloading song
    WAITING : "Waiting", //Waiting for download process to start
    PROCESSING : "Processing" // Initial status before process
};

module.exports = Song;