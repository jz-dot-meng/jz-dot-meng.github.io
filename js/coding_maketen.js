const userIn = document.getElementById('userIn');

// game variables
let numberArr;
let currentInd = 0;
let score;
let skips;
let userInput = '';
let evaluate = 0;
let leftRight = 0;
let answers = [];

// timer variables
let timer = 90, timerInterval;

// cookies and global data
let allTreesPlanted;
let nextGame;
let localStats;

/*
    **********************************************
    ----------------     Init   ------------------
    **********************************************
*/

const init = async () => {
    let response = await fetch('https://jz-dot-meng-mk10.herokuapp.com/getglobaldata', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await response.json();
    console.log('globaldata', data)
    allTreesPlanted = data.treesPlanted;
    nextGame = Number(data.nextGame);
    nextGameTimer(nextGame);
}
init();

/*
    **********************************************
    -----------    Game Functions   --------------
    **********************************************
*/

async function newgame() {
    // reset
    answers = [];
    timer = 90;
    skips = 3;
    score = 0;
    userInput = '';
    evaluate = 0;

    let cookies = window.localStorage.getItem('make10-localStatistics');
    let currentDate = Date.now();
    if (cookies === undefined || cookies === null) {
        console.log('new local storage')
        localStats = {
            gamesPlayed: 1,
            scoreCount: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
            treesPlanted: 0,
            lastStartedGame: currentDate,
        }
        window.localStorage.setItem('make10-localStatistics', JSON.stringify(localStats))
    } else {
        console.log('retrieved existing local storage')
        localStats = JSON.parse(cookies);
        // check if last game played < 24hrs before nextgame
        localStats.gamesPlayed++;
        localStats.lastStartedGame = currentDate;
    }

    // show/hide elements
    document.getElementById('newgame').style.visibility = 'hidden';
    document.getElementById('gameelements').style.visibility = 'visible';
    document.getElementById('skip').style.visibility = 'visible';
    document.getElementById('hints').style.visibility = 'visible';
    userIn.style.visibility = 'visible';
    userIn.focus();
    userIn.addEventListener('input', calculate);

    // fetch numbers
    const response = await fetch('https://jz-dot-meng-mk10.herokuapp.com/getnumbers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await response.json();
    // console.log(data);
    numberArr = shuffleArr(data);
    // console.log(numberArr);

    newtimer();
    nextNumber();

    // initial display
    document.getElementById('remainingtime').innerHTML = 'Remaining time: ' + timer;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    document.getElementById('skips').innerHTML = 'Skips: ' + skips;
}

function newtimer() {
    timerInterval = setInterval(async () => {
        timer--;
        if (timer === 0) {
            clearInterval(timerInterval);
            console.log('Timer removed', timerInterval);
            // hide elements
            userIn.style.visibility = 'hidden';
            document.getElementById('skip').style.visibility = 'hidden';
            // if score over 7, show winner 
            if (score >= 7) {
                document.getElementById('popup-winneradd').style.display = 'block';
            }
            // set cookies
            localStats.scoreCount[score]++;
            window.localStorage.setItem('make10-localStatistics', JSON.stringify(localStats));
            let totalScore = 0;
            for (let i = 0; i < Object.keys(localStats.scoreCount).length; i++) {
                totalScore += Object.keys(localStats.scoreCount)[i] * Object.values(localStats.scoreCount)[i]
            }
            // set popup stats
            document.getElementById('popup-score').innerHTML = 'Score: ' + score;
            document.getElementById('popup-gamesplayed').innerHTML = 'Games played: ' + localStats.gamesPlayed;
            document.getElementById('popup-average').innerHTML = 'Running average: ' + totalScore / localStats.gamesPlayed;
            document.getElementById('popup-localtrees').innerHTML = 'Trees planted: ' + localStats.treesPlanted;
            document.getElementById('popup-globalstats').innerHTML = 'Total trees planted: ' + allTreesPlanted;
            nextGameTimer(nextGame)
            // show post game tools
            document.getElementById('stats').style.visibility = 'visible';
            document.getElementById('popup').style.visibility = 'visible';
        }
        document.getElementById('remainingtime').innerHTML = 'Remaining time: ' + timer
    }, 1000)
}

const addWinner = async () => {
    let name = document.getElementById('winnername').value;
    let data = JSON.stringify({ 'answers': answers, 'winner': name });
    console.log(data);
    const post = await fetch('https://jz-dot-meng-mk10.herokuapp.com/validateanswers', {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'text/plain',
        },
    }).then(async (response) => {
        const serverResp = await response.json();
        if (serverResp.message === 'All correct!') {
            // increment tree cookie
            localStats.treesPlanted++;
        } else {
            alert('An error occured and your answers + name were not successfully validated\n' + serverResp.message)
        }
    });

}

const nextNumber = () => {
    leftRight = 0;
    document.getElementById('display').innerHTML = //numberArr[currentInd]
        `<span class='unused' id='${currentInd}-${numberArr[currentInd][0]}-0'>${numberArr[currentInd][0]}</span>
    <span class='unused' id='${currentInd}-${numberArr[currentInd][1]}-1'>${numberArr[currentInd][1]}</span>
    <span class='unused' id='${currentInd}-${numberArr[currentInd][2]}-2'>${numberArr[currentInd][2]}</span>
    <span class='unused' id='${currentInd}-${numberArr[currentInd][3]}-3'>${numberArr[currentInd][3]}</span>`
    userIn.focus();
}

const allowedSymbols = "%*()-+1/ "; // 1 for **1/n, or nth root
const calculate = (e) => {
    resetToUnused();
    let currentInput = ''
    if (e.target.value.includes('=')) {
        // min 5? x = x
        console.log('finding substring, e.target.value.length:', e.target.value.length)
        currentInput = e.target.value.substring(0, (e.target.value.length - (evaluate.toString().length + 3)))
    } else {
        currentInput = e.target.value;
    }
    console.log('currentInput', currentInput);
    // validate
    let allowedCharacters = numberArr[currentInd] + allowedSymbols;
    for (let i = 0; i < currentInput.length; i++) {
        if (allowedCharacters.indexOf(currentInput.charAt(i)) < 0) {
            // latest character is invalid
            invalidInputReset();
            return;
        }
    }

    if (currentInput.length > userInput.length) {
        console.log('user added new value')
        // user added a new value, all old values should be valid
        let matchedJInd = []
        if (currentInput.length > 1) {
            for (let i = 0; i < numberArr[currentInd].length; i++) {
                let match = false;
                for (let j = 0; j < currentInput.length - 1; j++) {
                    if (currentInput[j] === numberArr[currentInd][i] && !matchedJInd.includes(j)) {
                        match = true;
                        console.log('match true');
                        matchedJInd.push(j);
                        break;
                    }
                }
                if (match) {
                    if (document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.contains('unused')) {
                        document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.remove('unused')
                        document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.add('used')
                    }
                }
            }
        }
        // check latest value
        if (numberArr[currentInd].includes(currentInput[currentInput.length - 1])) {
            // is number
            console.log('checking latest value - is number')
            let freeMatch = false;
            let isOne = false
            for (let i = 0; i < numberArr[currentInd].length; i++) {
                if (numberArr[currentInd][i] === currentInput[currentInput.length - 1] && document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.contains('unused')) {
                    freeMatch = true;
                    if (numberArr[currentInd][i] === '1') { isOne = true; console.log('is one') };
                    document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.remove('unused')
                    document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.add('used')
                    break;
                }
            }
            // special case 1
            if (currentInput[currentInput.length - 1] === '1' && !isOne) {
                console.log('special case 1');
                // previous two inputs need to be **
                if (currentInput[currentInput.length - 2] === '*' && currentInput[currentInput.length - 3] === '*') {
                    // automatically add '/'
                    currentInput += '/';
                } else {
                    invalidInputReset();
                    return;
                }
            } else if (!freeMatch) {
                invalidInputReset();
                return;
            }
        }

    } else {
        // if user deletes an input, all values should be valid
        console.log('user deleted value')
        let matchedJInd = []
        for (let i = 0; i < numberArr[currentInd].length; i++) {
            let match = false;
            for (let j = 0; j < currentInput.length; j++) {
                if (currentInput[j] === numberArr[currentInd][i] && !matchedJInd.includes(j)) {
                    match = true;
                    matchedJInd.push(j);
                    break;
                }
            }
            if (match) {
                if (document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.contains('unused')) {
                    document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.remove('unused')
                    document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.add('used')
                }
            }
        }
    }

    userInput = currentInput;

    // calculate
    if (userInput !== '') {
        try {
            evaluate = Function(`'use strict'; return Number(${currentInput})`)();
            console.log('evaluate', evaluate)
        } catch (e) {
            console.log('not a valid expression, holding')
        }
        let expression = currentInput + ' = ' + evaluate;
        userIn.value = expression;
        setCursor(userIn, (userIn.value.length - (3 + leftRight + evaluate.toString().length)))
    } else {
        userIn.value = userInput;
    }
    validate();
}

const validate = () => {
    if (evaluate === 10 && document.getElementsByClassName('used').length === 4) {
        // increment score and ind
        let numberStr = typeof numberArr[currentInd] === 'string' ? numberArr[currentInd] : numberArr[currentInd].toString();
        answers.push({ [numberStr]: userInput })
        score++;
        currentInd++;
        // reset necessary values
        userInput = '';
        evaluate = 0;
        userIn.value = '';
        // display new score
        document.getElementById('score').innerHTML = 'Score: ' + score;
        // display new number
        document.getElementById('display').innerHTML = '';
        nextNumber();
    }
}

const skip = () => {
    if (skips > 0) {
        skips--;
        currentInd++;
        // reset necessary values
        userInput = '';
        evaluate = 0;
        userIn.value = '';
        // display new skips count
        document.getElementById('skips').innerHTML = 'Skips: ' + skips;
        // display new number
        document.getElementById('display').innerHTML = '';
        nextNumber();

    }
}

const resetToUnused = () => {
    console.log('setting all to unused')
    for (let i = 0; i < 4; i++) {
        if (document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.contains('used')) {
            document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.remove('used')
            document.getElementById(currentInd + '-' + numberArr[currentInd][i] + '-' + i).classList.add('unused')
        }
    }
}

const invalidInputReset = () => {
    console.log('invalid input, resetting to ', userInput)
    try {
        evaluate = Function(`'use strict'; return Number(${userInput})`)()
    } catch (e) {
        console.log('not a valid expression, holding')
    }
    if (userInput.length > 0) {
        userIn.value = userInput + ' = ' + evaluate;
    } else {
        userIn.value = userInput;
    }
    setCursor(userIn, (userIn.value.length - (3 + leftRight + evaluate.toString().length)))
}

// special left/right keypress event listener
document.addEventListener('keydown', (e) => {
    // check userIn is active element / focused
    console.log('is focused?', userIn === document.activeElement)
    if (userIn === document.activeElement) {
        let code = e.key;
        if (code === 'ArrowLeft' || code === '37') {
            // left
            if (leftRight < userInput.length) {
                leftRight++;
                console.log('leftright:', leftRight)
            }
        } else if (code === 'ArrowRight' || code === '39') {
            // right
            if (leftRight > 0) {
                leftRight--;
                console.log('leftright:', leftRight)
            }
        }
    }
}, true)

/*
    *************************************
    -----------    UTILS   --------------
    *************************************
*/

const shuffleArr = (array) => {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
        // Pick a remaining element
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        // Swap it with the current element.
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

const setCursor = (node, pos) => {

    node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;

    if (!node) {
        return false;
    } else if (node.createTextRange) {
        var textRange = node.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd(pos);
        textRange.moveStart(pos);
        textRange.select();
        return true;
    } else if (node.setSelectionRange) {
        node.setSelectionRange(pos, pos);
        return true;
    }

    return false;
}

const nextGameTimer = (nextgame) => {
    let timeToNextGame = Math.floor((nextgame - Date.now()) / 1000);
    const countdown = () => {
        timeToNextGame--;
        let seconds = timeToNextGame % 60;
        let minutes = Math.floor(timeToNextGame / 60) % 60;
        let hours = Math.floor(timeToNextGame / (60 * 60));
        document.getElementById('popup-hrs').innerHTML = hours + ' h ';
        document.getElementById('popup-min').innerHTML = minutes + ' m ';
        document.getElementById('popup-sec').innerHTML = seconds + ' s';
    }
    setInterval(countdown, 1000);
}

/* 
    *************************************
    --------    POPUP LOGIC    ----------
    *************************************
*/

const closepopup = () => {
    document.getElementById('popup').style.visibility = 'hidden'
}

const openpopup = () => {
    document.getElementById('popup').style.visibility = 'visible'
}