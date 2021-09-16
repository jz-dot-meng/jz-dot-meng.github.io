const colourlist = [
    { word: 'red', rgba: 'rgba(255,0,0,0.9)' },
    { word: 'blue', rgba: 'rgba(0,0,255,0.9)' },
    { word: 'green', rgba: 'rgba(0,255,0,0.8' },
    { word: 'cyan', rgba: 'rgba(0,255,255,0.8)' },
    { word: 'purple', rgba: 'rgba(204,0,255,1)' },
    { word: 'yellow', rgba: 'rgba(245,245,0,0.9)' },
    { word: 'orange', rgba: 'rgba(255,153,51,0.9)' },
]
let colourrand, rgbarand;

// other game variables
let score;
let playerchoice = "";
let avgfreq = [];

// timer variables
let startTime, timerInterval;
let elapsedTime = 0;

function newgame() {
    // hide newgame button and show choice buttons
    document.getElementById("newgame").style.visibility = "hidden";
    document.getElementById('nomatch').style.display = "flex";
    document.getElementById('match').style.display = "flex";
    document.getElementById('gameelements').style.visibility = "visible";

    score = 0;

    nextword();

    // event listeners
    document.getElementById("nomatch").setAttribute('onclick', 'returnnomatch()');
    document.getElementById("match").setAttribute('onclick', 'returnmatch()');
    document.addEventListener('keyup', keycode); // why does the function keycode not need the ()?
}

function keycode(e) {
    if (e.code === 'ArrowLeft') {
        // no match
        returnnomatch();
    } else if (e.code === 'ArrowRight') {
        // match
        returnmatch();
    }
}
function returnnomatch() {
    playerchoice = "nomatch";
    iscorrect();
}
function returnmatch() {
    playerchoice = "match";
    iscorrect();
}

function nextword() {
    // push freq timer to avgfreq array
    avgfreq.push(elapsedTime);
    // display current score
    document.getElementById("score").innerHTML = "Score: " + score;
    // generate new random word/colour
    colourrand = Math.floor(Math.random() * (colourlist.length - 0.1));
    let notfiftyfifty = Math.random();
    if (notfiftyfifty < 0.25) {
        rgbarand = colourrand;
    } else {
        rgbarand = Math.floor(Math.random() * (colourlist.length - 0.1));
    }
    document.getElementById("display").style.color = colourlist[rgbarand].rgba;
    document.getElementById("display").innerHTML = colourlist[colourrand].word;
    playerchoice = "";
    // new timer
    newtimer();
}

function iscorrect() {
    if (colourrand == rgbarand) {
        if (playerchoice == "nomatch") {
            document.getElementById('nomatch').style.display = "none";
            document.getElementById('match').style.display = "none";
            document.removeEventListener('keyup', keycode);
            // stop timer
            clearInterval(timerInterval);
            // display avg freq
            document.getElementById('frequency').innerHTML = "Avg freq: " + findavgfreq() / 10.0 + "ms";
            // display replay button;
            document.getElementById('newgame').innerHTML = "replay";
            document.getElementById('newgame').style.visibility = "visible";
        } else if (playerchoice == "match") {
            score++;
            nextword();
        }
    } else if (colourrand != rgbarand) {
        if (playerchoice == "match") {
            document.getElementById('nomatch').style.display = "none";
            document.getElementById('match').style.display = "none";
            document.removeEventListener('keyup', keycode);
            clearInterval(timerInterval);
            document.getElementById('frequency').innerHTML = "Avg freq: " + findavgfreq() / 10.0 + "ms";
            document.getElementById('newgame').innerHTML = "replay";
            document.getElementById('newgame').style.visibility = "visible";
        } else if (playerchoice == "nomatch") {
            score++;
            nextword();
        }
    }
}

function newtimer() {
    elapsedTime = 0;
    startTime = Date.now();
    if (score > 0) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        document.getElementById("frequency").innerHTML = "Freq: " + elapsedTime;
    }, 100);
}

function findavgfreq() {
    let total = 0;
    for (let i = 0; i < avgfreq.length; i++) {
        total += avgfreq[i];
    }
    let avg = total / avgfreq.length;
    return avg;
}

// gameloop, without creating a while-loop

// function nextword
// return random colourlist[word]
//  - 50/50 either return matching colourlist[rgba], or another colourlist[rgba]
// insert into document.getElementById("display");
// initiate freq timer

// if colourrand==rgbarand
//  - if button nomatch/arrowright
//      - gameover, show average freq?
//  - else if button match/arrowright
//      - increment score
//      - nextword()
// else if colourrand!=rgbarand
//  - if button nomatch/arrowright
//      - increment score
//      - nextword()

