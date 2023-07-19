import { BASE_API_URL } from './script';
import { Song } from './songData';

class Playlist{

    constructor(playlistName, trackLink){
        this.playlistName = playlistName;
        this.trackLink = trackLink;
        this.songs = []
    }

    async addSong(song){
        this.songs.push(song);
    }

    async addSongs(token){
        const playlistResults = await fetch(this.trackLink, {
            method: "GET", headers: {Authorization: `Bearer ${token}`}
        });

        const playlistResultsJson = await playlistResults.json();

        console.log("Loading all playlist songs");

        for(var i = 0; i < playlistResultsJson.items.length; i++){
            var artists = []
            for(var artist = 0; artist < playlistResultsJson.items[i].track.artists.length; artist++){
                artists.push(playlistResultsJson.items[i].track.artists[artist].name);
            }
            console.log("Adding ", playlistResultsJson.items[i].track.name, " by ", artists);
            this.addSong(new Song(playlistResultsJson.items[i].track.name, artists));
        }
    }

    removeSong(song){
        const index = this.songs.indexOf(song);
        if(index != -1){
            this.songs.splice(index, 1);
        }
    }

    clear(){
        this.songs = [];
    }

    getNumberOfSongs(){
        return this.songs.length;
    }
}

export async function collectTracksLinks(token, json){
    var playlists = []

    for(var i = 0; i < json.items.length; i++){
        playlists.push(new Playlist(json.items[i].name, json.items[i].tracks.href));
    } 

    for(var i = 0; i < playlists.length; i++){
        playlists[i].addSongs(token);
        console.log("playlists ", playlists[i].playlistName, " songs ", playlists[i].songs);
    }

    console.log("playlists ", playlists)

    return playlists;
}


export async function fetchPlaylist(token, profile) {
    const endpoint = BASE_API_URL + "users/" + profile.id + "/playlists";
    const result = await fetch(endpoint, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

