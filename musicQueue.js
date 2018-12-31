const Song = require("./song.js");

module.exports = class MusicQueue {
    constructor(guild) {
        this.guild = guild;
        this.queue = [];

        this.currentSong = null;
    }

    //Add a song to the queue
    add(url, requester, skipRatio){
        let song = new Song(this.guild, url, requester, skipRatio);
        this.queue.push(song);
        if (this.currentSong == null){
            this.loadNextSong();
        }
    }
    
    //Skip the currently playing song
    skip() {
        if (this.currentSong && this.currentSong.getStatus() != Song.states.DONE){
            this.currentSong.playRequested = false;
            if (this.currentSong.dispatcher) this.currentSong.dispatcher.end("Skipping");
            else {this.loadNextSong();}
        }
    }

    //Load next song from queue into "currently playing"
    loadNextSong(){
        if (this.queue.length > 0) {
            this.currentSong = this.queue.shift();
            this.currentSong.requestStart();
            return true;
        }
        else {
            this.currentSong = null;
            return false;
        }
    }

    //Return data about the current song
    getCurrentSong(){
        return this.currentSong;
    }
}