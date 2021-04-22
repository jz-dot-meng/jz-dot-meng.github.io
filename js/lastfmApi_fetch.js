const recentlyplayed = document.getElementById("recentlyplayed");
// const track = document.getElementsById("li"); // create a dummy htmlcollection global, to be replaced by api data?

// spotify scrobbles to last.fm, which has an api call 
  // base api: 'http://ws.audioscrobbler.com/2.0/'
  // xml: "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b";
  // json url for recently played: '/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=c81544cf4996253ffb848a8b771c506b&format=json'


async function callScrobble() {
  // await code here
  let result = await makeRequest("GET", "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mengbeats&api_key=31945ed15b54754af0b0a1c93a4a269b");
  // code below here will only execute when await makeRequest() finishes loading
  let track = result.getElementsByTagName("track");
  recentlyplayed.innerHTML = "<table>";
  for(i=0;i<track.length;i++){
    recentlyplayed.innerHTML += "<tr><td><img src='";
    console.log('is this even procesing?');
    recentlyplayed.innerHTML += track[i].childNodes[15].innerHTML;
    recentlyplayed.innerHTML += "'></td><td>";
    console.log('even just a little??');
    recentlyplayed.innerHTML += track[i].childNodes[3].innerHTML;
    recentlyplayed.innerHTML += "</td><td>";
    recentlyplayed.innerHTML += track[i].childNodes[1].innerHTML;
    recentlyplayed.innerHTML += "</td></tr>";
  }
  recentlyplayed.innerHTML += "</table>";
  console.log(recentlyplayed.innerHTML);
}

document.addEventListener("DOMContentLoaded", function(){
  
});

function makeRequest(method, url) {
  return new Promise(function (resolve, reject){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, url, true);
    xmlhttp.onload = function(){
      if(this.status >= 200 && this.status < 300){
        resolve(xmlhttp.responseXML);
      } else {
        reject({
          status: this.status,
          statusText: xmlhttp.statusText
        });
      }
    };
    xmlhttp.onerror = function(){
      reject({
          status: this.status,
          statusText: xmlhttp.statusText
      });
    };
    xmlhttp.send();
  });
}

callScrobble();
