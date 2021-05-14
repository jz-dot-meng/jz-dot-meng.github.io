const unknownword = document.getElementById('unknownword');
const guess = document.getElementById('guess');
const submit = document.getElementById('submit');
const error = document.getElementById('error');
const incorrectguesses = document.getElementById('incorrectguesses');

let newword = '';
let hiddenword = '';

const unknown = '_ ';

async function callWordnik(){
  let apireq = await makeRequest("GET", "http://api.wordnik.com/v4/words.json/randomWord?api_key=YOURKEYHERE");
  newword = apireq["word"];
  hiddenword = unknown.repeat(newword.length);
  unknownword.innerHTML += hiddenword;
}

