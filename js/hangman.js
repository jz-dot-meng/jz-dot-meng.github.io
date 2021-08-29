let newword = "";
let hiddenword = "";
let numwrongguess = 0;
let incorrect = "";

let unknown = "_ ";

async function callWordnik(){
  const unknownword = document.getElementById("unknownword");
  const guess = document.getElementById("guess");
  const submit = document.getElementById("submit");
  const error = document.getElementById("error");
  const incorrectguesses = document.getElementById("incorrectguesses");
  //let apireq = await makeRequest("GET", "https://api.wordnik.com/v4/words.json/randomWord?api_key=e0m3otfuzjft9r5fr7z524tm2tj5yq2t5qug5zs5qht1sp8gy");
  fetch("https://api.wordnik.com/v4/words.json/randomWord?api_key=e0m3otfuzjft9r5fr7z524tm2tj5yq2t5qug5zs5qht1sp8gy").then(response=>{
    return response.json();
  }).then(data=>{
    const{id,word} = data;
    newword = word;
    hiddenword = unknown.repeat(newword.length);
    unknownword.innerText = hiddenword;
  });
}

// testing onload
function demo(){
  const unknownword = document.getElementById("unknownword");
  const guess = document.getElementById("guess");
  const submit = document.getElementById("submit");
  const error = document.getElementById("error");
  const incorrectguesses = document.getElementById("incorrectguesses");
  newword = "crypt";
  hiddenword = unknown.repeat(newword.length);
  unknownword.innerText = hiddenword;
}

// onclick function
function checkletter(){
  const unknownword = document.getElementById("unknownword");
  const guess = document.getElementById("guess");
  const submit = document.getElementById("submit");
  const error = document.getElementById("error");
  const incorrectguesses = document.getElementById("incorrectguesses");
  let letter = guess.value;
  // validate
  if(typeof letter != 'string'){
    error.innerText = 'Please enter a letter';
  } else if (letter.length > 1){
    error.innerText = 'Please only enter one letter';
  } else {
    // check for match in newword
    let isInWord = false;
    for(let i=0;i<newword.length;i++){
      if(newword[i]==letter){
        // demo word 'crypt' hiddenword equiv '_ _ _ _ _ '; we want indexes 0,2,4,6,8 from iterators 0,1,2,3,4
        isInWord=true;
        hiddenword = hiddenword.substring(0,2*i)+letter+hiddenword.substring(2*i+1);
        unknownword.innerText = hiddenword;
      } else {
        continue;
      }
    }
    if(isInWord==true){
        draw(numwrongguess);
    } else{
        if(incorrect==""){
            incorrect = "incorrect guesses: "+letter;
            incorrectguesses.innerText= incorrect;
        } else{
            incorrectguesses.innerText += ", "+letter;
        }
        numwrongguess++;
        draw(numwrongguess);
    }
  }
  // check for win
  if(hiddenword.replace(/ /g,"")==newword){
    incorrectguesses.innerText="Congratulations, you guessed the word!";
    guess.parentNode.removeChild(guess);
    submit.parentNode.removeChild(submit);
    // insert replay
    const form = document.getElementById("guessLetter");
    const replay = document.createElement("input");
    replay.setAttribute("type","button");
    replay.setAttribute("value", "replay");
    replay.setAttribute("onclick", "reload()");
    form.appendChild(replay);
  } else if(numwrongguess==11){
    incorrectguesses.innerText="You lost, the word was "+newword;
    guess.parentNode.removeChild(guess);
    submit.parentNode.removeChild(submit);
    const form = document.getElementById("guessLetter");
    const replay = document.createElement("input");
    replay.setAttribute("type","button");
    replay.setAttribute("value", "replay");
    replay.setAttribute("onclick", "reload()");
    form.appendChild(replay);
  }


  guess.value="";
  return false;
}

function reload(){
    location.reload();
}

function draw(noIncorrect){
    switch(noIncorrect){
        case 1:
            gallow = "</br></br></br></br></br></br>___</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 2:
            gallow = "</br>"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 3:
            gallow = "</br>"+
                "</br>&nbsp;&nbsp;|-------"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 4:
            gallow = "</br>"+
                "</br>&nbsp;&nbsp;|-/-----"+
                "</br>&nbsp;&nbsp;|/"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 5:
            gallow = "</br>"+
                "</br>&nbsp;&nbsp;|-/-----|"+
                "</br>&nbsp;&nbsp;|/"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 6:
            gallow = "</br>"+
                "</br>&nbsp;&nbsp;|-/-----|"+
                "</br>&nbsp;&nbsp;|/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0"+
                "</br>&nbsp;&nbsp;|"+
                "</br>&nbsp;&nbsp;|"+
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 7:
            gallow = "</br>"+
                "</br>&nbsp;&nbsp;|-/-----|"+
                "</br>&nbsp;&nbsp;|/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0"+
                "</br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| "+
                "</br>&nbsp;&nbsp;|"+
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 8:
            gallow = "</br>"+
                "</br>&nbsp;&nbsp;|-/-----|"+
                "</br>&nbsp;&nbsp;|/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0"+
                "</br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/|&nbsp;"+
                "</br>&nbsp;&nbsp;|"+
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 9:
            gallow = "</br>" +
                "</br>&nbsp;&nbsp;|-/-----|" +
                "</br>&nbsp;&nbsp;|/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0" +
                "</br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/|\\" +
                "</br>&nbsp;&nbsp;|" +
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 10:
            gallow = "</br>" +
                "</br>&nbsp;&nbsp;|-/-----|" +
                "</br>&nbsp;&nbsp;|/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0" +
                "</br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/|\\" +
                "</br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ " +
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        case 11:
            gallow = "</br>" +
                "</br>&nbsp;&nbsp;|-/-----|" +
                "</br>&nbsp;&nbsp;|/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0" +
                "</br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/|\\" +
                "</br>&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ \\ bad luck!" +
                "</br>_|_</br>";
            document.getElementById("graphic").innerHTML = gallow;
            break;
        default:
            return "Invalid amount";
    }


}
