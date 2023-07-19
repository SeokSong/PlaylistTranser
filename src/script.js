import { getAccessToken, redirectToAuthCodeFlow } from './login';
import { fetchProfile, populateUI } from './profileData';
import { fetchPlaylist, collectTracksLinks } from './playlistData';

const clientId = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
export const BASE_API_URL = "https://api.spotify.com/v1/";

async function fetchData(clientId, code) {
    // If code is not available, redirect to the authentication flow and return early.
    if (!code) {
      redirectToAuthCodeFlow(clientId);
      return;
    }
  
    try {
      const accessToken = await getAccessToken(clientId, code);
      const userProfile = await fetchProfile(accessToken);
      const playlistIds = await fetchPlaylist(accessToken, userProfile);
      console.log("fetch Playlist: ", playlistIds);
      const playlist = await collectTracksLinks(accessToken, playlistIds);

    
      console.log("Playlist data: ", playlist);
      populateUI(userProfile);
    } catch (error) {
      console.error("Error occurred:", error);
    }
}
  // Call the fetchData function with appropriate arguments.
fetchData(clientId, code);