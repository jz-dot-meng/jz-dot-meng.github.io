const unknownword = document.getElementById('unknownword');
const guess = document.getElementById('guess');
const submit = document.getElementById('submit');
const error = document.getElementById('error');
const incorrectguesses = document.getElementById('incorrectguesses');

let newword = '';
let hiddenword = '';
let numwrongguess = 0;

const unknown = '_ ';

async function callWordnik(){
  let apireq = await makeRequest("GET", "http://api.wordnik.com/v4/words.json/randomWord?api_key=e0m3otfuzjft9r5fr7z524tm2tj5yq2t5qug5zs5qht1sp8gy");
  newword = apireq["word"];
  hiddenword = unknown.repeat(newword.length);
  unknownword.innerHTML = hiddenword;
}

// testing 
function demo(){
  newword = 'crypt';
  hiddenword = unknown.repeat(newword.length);
  unknownword.innerHTML = hiddenword;
}
demo();

// onclick function
function checkletter(){
  let letter = guess.value;
  if(typeof letter != 'string'){
    error.innerHTML = 'Please enter a letter';
  } else if (letter.length > 1){
    error.innerHTML = 'Please only enter one letter';
  } else {
    for(i=0;i<newword;i++){
      if(newword[i]==letter){
        // demo word 'crypt' hiddenword equiv '_ _ _ _ _ '; we want indexes 0,2,4,6,8 from iterators 0,1,2,3,4
        hiddenword = hiddenword.replace(hiddenword[(2*i)],letter);
        unknownword.innerHTML = hiddenword;
      } else {
        incorrectguesses.innerHTML += letter+" ";
        numwrongguess++;
      }
    }
  }
}

submit.onclick = checkletter();

