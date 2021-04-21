const recentlyplayed = document.getElementById("recentlyplayed");

// spotify scrobbles to last.fm, which has an api call 

function getScrobbleInfo(){
  const lastfmApi = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b&format=json";
  // base api: 'http://ws.audioscrobbler.com/2.0/'
  // json url for recently played: '/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=c81544cf4996253ffb848a8b771c506b&format=json'
  fetch(lastfmApi)
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      console.log(json);
      var tracks = json.message;
      recentlyplayed.innerHTML += tracks;
    })
    .catch(function(error){
      console.log(error);
    });
}

getScrobbleInfo();
