const recentlyplayed = document.getElementById("recentlyplayed");

// spotify scrobbles to last.fm, which has an api call 

  // base api: 'http://ws.audioscrobbler.com/2.0/'
  // xml: "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b";
  // json url for recently played: '/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=c81544cf4996253ffb848a8b771c506b&format=json'



function callScrobble() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      myFunction(xmlhttp);
    }
  };
  xmlhttp.open("GET", "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b", true);
  xmlhttp.send();
}
function myFunction(xml) {
  const xmlDoc = xml.responseXML;
  recentlyplayed.innerHTML += "<table>";
  let track = xmlDoc.getElementsByTagName("track");
  console.log(track);
  for(i=0;i<track.length;i++){
    recentlyplayed.innerHTML += "<tr><td><img src='";
    recentlyplayed.innerHTML += track[i].getElementsByTagName("Image")[1].innerHTML;
    recentlyplayed.innerHTML += "'></td><td>";
    recentlyplayed.innerHTML += track[i].getElementsByTagName("Name").innerHTML;
    recentlyplayed.innerHTML += "</td><td>";
    recentlyplayed.innerHTML += track[i].getElementsByTagName("Artist").innerHTML;
    recentlyplayed.innerHTML += "</td></tr>";
  }
  recentlyplayed.innerHTML += "</table>";
}

callScrobble();

