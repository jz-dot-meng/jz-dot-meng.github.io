const recentlyplayed = document.getElementById("recentlyplayed");

// spotify scrobbles to last.fm, which has an api call 

function getScrobbleInfo(){
  const lastfmApi = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b";
  // base api: 'http://ws.audioscrobbler.com/2.0/'
  // json url for recently played: '/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=c81544cf4996253ffb848a8b771c506b&format=json'
  
  parser = new DOMParser();
  
  fetch(lastfmApi)
    .then(function(response){
      const tracks = parser.parseFromString(response, "application/xml");
      recentlyplayed.innerHTML += tracks;
    })
    .catch(function(error){
      console.log(error);
    });
}

getScrobbleInfo();
