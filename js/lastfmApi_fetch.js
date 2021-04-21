const recentlyplayed = document.getElementById("recentlyplayed");
// spotify scrobbles to last.fm, which has an api call 

  // base api: 'http://ws.audioscrobbler.com/2.0/'
  // xml: "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b";
  // json url for recently played: '/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=c81544cf4996253ffb848a8b771c506b&format=json'



function callScrobble(path) {
    return new Promise(function (resolve, reject) {
        axios.get(path).then(
            (response) => {
                var result = response.data;
                console.log('Processing Request');
                resolve(result); // do i need .responseXML?
            },
                (error) => {
                reject(error);
            }
        );
    });
}

async function main(){
  const result = await callScrobble("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b");
  recentlyplayed.innerHTML = "<table>";
  const track = result.getElementsByTagName("track");
  for(i=0;i<track.length;i++){
    recentlyplayed.innerHTML += "<tr><td><img src='";
    recentlyplayed.innerHTML += track[i].childNodes[15].innerHTML;
    recentlyplayed.innerHTML += "'></td><td>";
    recentlyplayed.innerHTML += track[i].childNodes[3].innerHTML;
    recentlyplayed.innerHTML += "</td><td>";
    recentlyplayed.innerHTML += track[i].childNodes[1].innerHTML;
    recentlyplayed.innerHTML += "</td></tr>";
  }
  recentlyplayed.innerHTML += "</table>";
  console.log(recentlyplayed.innerHTML);
}
main();



