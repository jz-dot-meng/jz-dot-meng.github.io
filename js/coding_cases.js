const sentenceFile = '/js/data/polishsentences.xml';
const wordFile = '/js/data/polishwords.xml';

const displayPolish = document.getElementById('polish');
const displayEnglish = document.getElementById('translation')
const choiceDiv = document.getElementById('choices');

const hintDiv = document.getElementById('hint');
const nextDiv = document.getElementById('next');
const hintToolTip = document.getElementById('tooltip');

let sentenceList, wordList;

let correctCase, wordRef;

let choiceArr = [];

const chooseRandomSentence = () => {
    // choose category
    let rand1 = Math.floor(Math.random() * (sentenceList.length - 0.01));
    let thisCase = sentenceList[rand1];

    // choose random sentence within category
    let rand2 = Math.floor(Math.random() * (thisCase.getElementsByTagName('sentence').length - 0.01));
    let thisSentence = thisCase.getElementsByTagName('sentence')[rand2];

    correctCase = thisCase.tagName;
    wordRef = thisSentence.getAttribute('ref');

    displayPolish.innerHTML = thisSentence.getElementsByTagName('disp')[0].innerHTML;
    displayEnglish.innerHTML = thisSentence.getElementsByTagName('trans')[0].innerHTML;
    hintToolTip.innerHTML = thisSentence.getAttribute('hint');
}

const generateChoices = () => {
    let word;
    for (let i = 0; i < wordList.length; i++) {
        if (wordList[i].getAttribute('ref') == wordRef) {
            word = wordList[i];
            break;
        }
    }
    //console.log(word.childNodes);

    // re-init choice array
    choiceArr = [];
    // push correct ans
    choiceArr.push({ case: correctCase, word: word.getElementsByTagName(correctCase)[0].innerHTML });
    while (choiceArr.length < 4) {
        let random = 2 * Math.floor(Math.random() * 7 - 0.01) + 1; // need to gen 1,3,5,7,9,11,13
        if (word.childNodes[random].innerHTML != word.getElementsByTagName(correctCase)[0].innerHTML) {
            choiceArr.push({ case: word.childNodes[random].tagName, word: word.childNodes[random].innerHTML })
        }
    }
    shuffleArray(choiceArr);
    console.log(choiceArr);

    for (let i = 0; i < choiceArr.length; i++) {
        // generate button
        let button = document.createElement('button');
        button.classList.add('choiceButton');
        button.setAttribute('id', choiceArr[i].case)
        button.innerHTML = choiceArr[i].word
        button.addEventListener('click', validate, false)
        choiceDiv.appendChild(button);
    }
}

const validate = (e) => {
    if (e.target.id == correctCase) {
        // hint hide
        hintDiv.classList.remove('hintBlock');
        hintDiv.classList.add('toggleHide');
        // next button show
        nextDiv.classList.remove('toggleHide');
        nextDiv.classList.add('nextFlex');
        // replace word
        for (let i = 0; i < choiceArr.length; i++) {
            if (choiceArr[i].case === correctCase) {
                let span = `<span style='color:limegreen;font-weight:normal'>${choiceArr[i].word}</span>`;
                displayPolish.innerHTML = displayPolish.innerHTML.replace('_____', span);
            }
        }
    } else {
        e.target.disabled = true;
    }
}

const newWord = () => {
    // delete buttons
    while (choiceDiv.lastChild) {
        choiceDiv.removeChild(choiceDiv.lastChild)
    }
    chooseRandomSentence();
    generateChoices();
    nextDiv.classList.remove('nextFlex');
    nextDiv.classList.add('toggleHide');
    hintDiv.classList.remove('toggleHide');
    hintDiv.classList.add('hintBlock')
}

// helper functions
function shuffleArray(array) {
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
}

const init = async () => {
    const xmlSentence = new XMLHttpRequest();
    xmlSentence.onreadystatechange = function () {
        // Request finished and response 
        // is ready and Status is "OK"
        if (this.readyState == 4 && this.status == 200) {
            const sentenceListCollection = this.responseXML.getElementsByTagName('sentences');
            sentenceList = sentenceListCollection[0].children;
            console.log(sentenceList);
        }
    };
    const xmlWord = new XMLHttpRequest();
    xmlWord.onreadystatechange = function () {
        // Request finished and response 
        // is ready and Status is "OK"
        if (this.readyState == 4 && this.status == 200) {
            const wordListCollection = this.responseXML.getElementsByTagName('wordlist');
            wordList = wordListCollection[0].children;
            console.log(wordList);
        }
    };


    xmlSentence.open("GET", sentenceFile, true);
    xmlSentence.send();

    xmlWord.open("GET", wordFile, true);
    xmlWord.send();

    nextDiv.classList.add('toggleHide');
    hintDiv.classList.add('hintBlock')
    // generate first 
    // choose category
    setTimeout(() => {
        chooseRandomSentence();
        generateChoices();

    }, 1000)
}
init();
