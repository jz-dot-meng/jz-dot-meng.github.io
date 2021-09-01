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
  let date = Date.parse(result.getElementsByTagName("date")[0].childNodes[0].nodeValue+" EST");
  let printDate = new Date(date).toDateString();
  let isCurrent = new Date();
  isCurrent = Date.parse(isCurrent);
  let howCurrent = date - isCurrent;
  if(howCurrent<15000000){
    lastlistened.innerHTML+= "<p>&#128308;LIVE Currently listening to: </p>";
    recentlyplayed.innerHTML += "<table><tbody><tr><td><img src='"+track[0].childNodes[15].innerHTML+"'></td><td>"+track[0].childNodes[3].innerHTML+"</td><td>"+track[0].childNodes[1].innerHTML+"</td></tr></tbody></table>";
    let otherlistened = document.createElement("div");
    otherlistened.setAttribute("id","otherlistened");
    otherlistened.innerHTML+="<p>Recently played: </p>";
    document.getElementById("container").appendChild(otherlistened);
    let pastplayed = document.createElement("div");
    pastplayed.setAttribute("id","pastplayed");
    for(i=1;i<track.length;i++){
      pastplayed.innerHTML += "<table><tbody><tr><td><img src='"+track[i].childNodes[15].innerHTML+"'></td><td>"+track[i].childNodes[3].innerHTML+"</td><td>"+track[i].childNodes[1].innerHTML+"</td></tr></tbody></table>";
    }
    document.getElementById("container").appendChild(pastplayed);
    let button = document.createElement("button");
    button.setAttribute("id","showHide")
    button.setAttribute("type","button");
    button.innerHTML="Show more";
    button.setAttribute("onclick", "showRows()");
    let width = getComputedStyle(document.querySelector("tbody")).width;
    button.setAttribute("style","position:relative; width:"+width+";")
    pastplayed.appendChild(button);
    hideRows();
  } else {
    lastlistened.innerHTML+="<p>Last listened: "+printDate+"</p>";
    //recentlyplayed.innerHTML = "<table>";
    for(i=0;i<track.length;i++){
      recentlyplayed.innerHTML += "<table><tbody><tr><td><img src='"+track[i].childNodes[15].innerHTML+"'></td><td>"+track[i].childNodes[3].innerHTML+"</td><td>"+track[i].childNodes[1].innerHTML+"</td></tr></tbody></table>";
    }
    let button = document.createElement("button");
    button.setAttribute("id","showHide")
    button.setAttribute("type","button");
    button.innerHTML="Show more";
    button.setAttribute("onclick", "showRows()");
    let width = getComputedStyle(document.querySelector("tbody")).width;
    button.setAttribute("style","position:relative; width:"+width+";")
    recentlyplayed.appendChild(button);
    hideRows();
  }

}

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

function showRows(){
    let tr = document.getElementsByTagName('tr');
    for(i=0;i<tr.length;i++){
        if(i>5){
            tr[i].style.display = 'inline';
        }
    }
    let button = document.getElementById("showHide");
    button.innerHTML="Show less";
    button.setAttribute("onclick", "hideRows()");
}

function hideRows(){
    let tr = document.getElementsByTagName('tr');
    for(i=0;i<tr.length;i++){
        if(i>5){
            tr[i].style.display = 'none';
        }
    }
    let button = document.getElementById("showHide");
    button.innerHTML="Show more";
    button.setAttribute("onclick", "showRows()");
}

callScrobble();
