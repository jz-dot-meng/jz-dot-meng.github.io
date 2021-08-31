let level = 1;
let levelArr = [];

function startgame(){
    document.getElementById("control").style.display="none";
    document.getElementById("score").innerText = "Level "+level;
    // draw board
    drawboard(level);
    // create levelArray, show memory tiles
    let pause1 = setTimeout(function(){
        levelArr = generateArray(level);
        showLimited(levelArr);
    },500);
    // hide memory tiles
    let hide = setTimeout(function(){
        for(let i=1;i<=16;i++){
            document.getElementById(i).style.background = 'gainsboro';
        }
        document.getElementById("score").innerText = "Pick out the correct positions";
    },1000);
    // event listener
    document.querySelectorAll(".gametile").forEach(button=>{
        button.addEventListener('click', function(){
            // return id
            let id = button.id;
            let isCorrect = false;
            //is in arr?
            for(let i =0; i<levelArr.length;i++){
                if(levelArr[i]==id){
                    // match
                    isCorrect=true;
                    // remove from arr
                    levelArr.splice(i,1);
                    // colour
                    button.style.background = 'coral';
                    // check for level end
                    let allSelected = levelPassed();
                    if (allSelected==true){
                        level++;
                        let pause2 = setTimeout(function(){
                            newlevel(level);
                        },500);
                        break;
                    }
                } 
            }
            // if no match
            if(isCorrect==false){
                document.getElementById("score").innerText="Game over!";
              // ADD PLAY AGAIN
              // PREVENT FURTHER PLAY
            }
        })
    })
    // user input, validate
    // if correct, level increment    
}


function newlevel(level){
    document.getElementById("score").innerText = "Level "+level;
    // plain board
    drawboard(level);
    // create levelArray, show memory tiles
    let pause1 = setTimeout(function(){
        levelArr = generateArray(level);
        showLimited(levelArr);
    },500);
    // hide memory tiles
    let hide = setTimeout(function(){
        for(let i=1;i<=16;i++){
            document.getElementById(i).style.background = 'gainsboro';
        }
        document.getElementById("score").innerText = "Pick out the correct positions";
    },1000);
    // event listener
    document.querySelectorAll(".gametile").forEach(button=>{
        button.addEventListener('click', function(){
            // return id
            let id = button.id;
            let isCorrect = false;
            //is in arr?
            for(let i =0; i<levelArr.length;i++){
                if(levelArr[i]==id){
                    // match
                    isCorrect=true;
                    // remove from arr
                    levelArr.splice(i,1);
                    // colour
                    button.style.background = 'coral';
                    // check for level end?
                    let allSelected = levelPassed();
                    if (allSelected==true){
                        level++;
                        let pause2 = setTimeout(function(){
                            newlevel(level);
                        },500);
                        break;
                    }
                } 
            }
            // if no match
            if(isCorrect==false){
                document.getElementById("score").innerText="Game over!";
            }
        })
    })
}

function drawboard(level){
    // remove all buttons
    document.querySelectorAll(".gametile").forEach(button=>{
        button.parentNode.removeChild(button);
    })
    //
    if(level<4){
        let count=1;
        for(let j=0;j<4;j++){ // j = column
            for(let p=0;p<4;p++){ // p = row
                let button = document.createElement("button");
                button.setAttribute("id",count);
                button.setAttribute("class","gametile")
                button.setAttribute("style","position:absolute;width:40px;height:40px;left:"+p*40+"px;top:"+j*40+"px;")
                document.getElementById("drawboard").appendChild(button);
                count++;
            }
        }
    }
    if(level>=4&&level<7){
        let count=1;
        for(let j=0;j<4;j++){ // j = column
            for(let p=0;p<5;p++){ // p = row
                let button = document.createElement("button");
                button.setAttribute("id",count);
                button.setAttribute("class","gametile")
                button.setAttribute("style","position:absolute;width:40px;height:40px;left:"+p*40+"px;top:"+j*40+"px;")
                document.getElementById("drawboard").appendChild(button);
                count++;
            }
        }
    }
    if(level>=7&&level<10){
        let count=1;
        for(let j=0;j<5;j++){ // j = column
            for(let p=0;p<5;p++){ // p = row
                let button = document.createElement("button");
                button.setAttribute("id",count);
                button.setAttribute("class","gametile")
                button.setAttribute("style","position:absolute;width:40px;height:40px;left:"+p*40+"px;top:"+j*40+"px;")
                document.getElementById("drawboard").appendChild(button);
                count++;
            }
        }
    }
    if(level>=10&&level<13){
        let count=1;
        for(let j=0;j<5;j++){ // j = column
            for(let p=0;p<6;p++){ // p = row
                let button = document.createElement("button");
                button.setAttribute("id",count);
                button.setAttribute("class","gametile")
                button.setAttribute("style","position:absolute;width:40px;height:40px;left:"+p*40+"px;top:"+j*40+"px;")
                document.getElementById("drawboard").appendChild(button);
                count++;
            }
        }
    }
}

function generateArray(level){
    if(level<4){
        let count = level+2;
        let newSet = new Set();
        while(newSet.size < count){
            newSet.add(Math.ceil(Math.random()*16));
        }
        let levelAr = [];
        for(let item of newSet){
            levelAr.push(item);
        }
        return levelAr;
    }
    if(level>=4&&level<7){
        let count = level+1;
        let newSet = new Set();
        while(newSet.size < count){
            newSet.add(Math.ceil(Math.random()*16));
        }
        let levelAr = [];
        for(let item of newSet){
            levelAr.push(item);
        }
        return levelAr;
    }
    if(level>=7&&level<10){
        let count = level+1;
        let newSet = new Set();
        while(newSet.size < count){
            newSet.add(Math.ceil(Math.random()*16));
        }
        let levelAr = [];
        for(let item of newSet){
            levelAr.push(item);
        }
        return levelAr;
    }
    if(level>=10&&level<13){
        let count = level;
        let newSet = new Set();
        while(newSet.size < count){
            newSet.add(Math.ceil(Math.random()*16));
        }
        let levelAr = [];
        for(let item of newSet){
            levelAr.push(item);
        }
        return levelAr;
    }
}

function showLimited(levelArr){
    for(let i=0; i<levelArr.length; i++){
        document.getElementById(levelArr[i]).style.background = 'coral';
    }
}

function levelPassed(){
    if(levelArr.length==0){
        return true;
    } else {
        return false;
    }
}


    // level1 - 4x4, 3
    // level2 - 4x4, 4
    // level3 - 4x4, 5

    // level4 - 4x5, 5
    // level5 - 4x5, 6
    // level6 - 4x5, 7

    // level7 - 5x5, 7
    // level8 - 5x5, 8
    // level9 - 5x5, 9

    // l10 - 5x6, 9
    // l11 - 5x6, 10
    // l12 - 5x6, 11
