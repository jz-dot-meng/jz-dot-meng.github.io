const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth / 2;
canvas.height = window.innerWidth / 2;

function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
init();

let a = 2;
let b = 1.6706;
let c = -0.5;
let d = -1.1254;

// a = 2, b = 1.6706, c = -0.5, d = -1.1254
// a = 0.85, b = 1.6706 c = 0.5, d = -1.1254

let rChange = -0.0001;
let gChange = 0.00006;
let bChange = 0.00066;

let colourArr = [240, 140, 70];
let changedColour = colourArr.slice();

let iterations = 20000;

function draw(x, y) {
    ctx.fillStyle = 'rgba(' + Math.ceil(changedColour[0]) + ',' + Math.ceil(changedColour[1]) + ',' + Math.ceil(changedColour[2]) + ',1)'//`rgba(${colourArr[1]},${colourArr[2]},${colourArr[3]},0.7)`
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

let currentX = canvas.width / 2;
let currentY = canvas.height / 2;

function calculate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < iterations; i++) {
        if (changedColour[0] > 0 || changedColour[0] < 255) {
            changedColour[0] += rChange;
        } else {
            changedColour[0] = 128;
        }
        if (changedColour[1] > 0 || changedColour[1] < 255) {
            changedColour[1] += gChange;
        } else {
            changedColour[1] = 128;
        }
        if (changedColour[2] > 0 || changedColour[2] < 255) {
            changedColour[2] += bChange;
        } else {
            changedColour[2] = 128;
        }
        let oldX = currentX;
        let oldY = currentY;
        currentX = Math.sin(a * oldY) + c * Math.cos(a * oldX);
        currentY = (Math.sin(b * oldX) + d * Math.cos(b * oldY));
        draw(canvas.width * (currentX + 3) / 6, canvas.height * (currentY + 3) / 6);
    }
}
calculate();


// ****************** HTML CONTROLS *******************
// clifford controls
const aSlider = document.getElementById("aSlider");
const aDisplay = document.getElementById("aDisplay");
aSlider.addEventListener('input', () => {
    aDisplay.innerText = aSlider.value
    a = aSlider.value;
    calculate();
});
const bSlider = document.getElementById("bSlider");
const bDisplay = document.getElementById("bDisplay");
bSlider.addEventListener('input', () => {
    bDisplay.innerText = bSlider.value
    b = bSlider.value;
    calculate();
})
const cSlider = document.getElementById("cSlider");
const cDisplay = document.getElementById("cDisplay");
cSlider.addEventListener('input', () => {
    cDisplay.innerText = cSlider.value
    c = cSlider.value;
    calculate();
})
const dSlider = document.getElementById("dSlider");
const dDisplay = document.getElementById("dDisplay");
dSlider.addEventListener('input', () => {
    dDisplay.innerText = dSlider.value
    d = dSlider.value;
    calculate();
})

// rgb controls
const redSlider = document.getElementById("redSlider");
const redDisplay = document.getElementById("redDisplay");
redSlider.addEventListener('input', () => {
    redDisplay.innerText = redSlider.value
    colourArr[0] = redSlider.value;
    changedColour = colourArr.slice();
    calculate();
});
const greenSlider = document.getElementById("greenSlider");
const greenDisplay = document.getElementById("greenDisplay");
greenSlider.addEventListener('input', () => {
    greenDisplay.innerText = greenSlider.value
    colourArr[1] = greenSlider.value;
    changedColour = colourArr.slice();
    calculate();
});
const blueSlider = document.getElementById("blueSlider");
const blueDisplay = document.getElementById("blueDisplay");
blueSlider.addEventListener('input', () => {
    blueDisplay.innerText = blueSlider.value
    colourArr[2] = blueSlider.value;
    changedColour = colourArr.slice();
    calculate();
});
const rgradSlider = document.getElementById("rgradSlider");
const rgradDisplay = document.getElementById("rgradDisplay");
rgradSlider.addEventListener('input', () => {
    rgradDisplay.innerText = rgradSlider.value
    rChange = rgradSlider.value * 0.00001
    calculate();
});
const ggradSlider = document.getElementById("ggradSlider");
const ggradDisplay = document.getElementById("ggradDisplay");
ggradSlider.addEventListener('input', () => {
    ggradDisplay.innerText = ggradSlider.value
    gChange = ggradSlider.value * 0.00001
    calculate();
});
const bgradSlider = document.getElementById("bgradSlider");
const bgradDisplay = document.getElementById("bgradDisplay");
bgradSlider.addEventListener('input', () => {
    bgradDisplay.innerText = bgradSlider.value
    bChange = rgradSlider.value * 0.00001
    calculate();
});

// particle control
const particleSlider = document.getElementById('particleSlider');
const particleDisplay = document.getElementById('particleDisplay');
particleSlider.addEventListener('input', () => {
    particleDisplay.innerText = particleSlider.value
    iterations = particleSlider.value;
    calculate();
});

// display initial values for sliders
aSlider.value = a;
bSlider.value = b;
cSlider.value = c;
dSlider.value = d;
aDisplay.innerText = a;
bDisplay.innerText = b;
cDisplay.innerText = c;
dDisplay.innerText = d;
redSlider.value = colourArr[0];
greenSlider.value = colourArr[1];
blueSlider.value = colourArr[2];
redDisplay.innerText = colourArr[0];
greenDisplay.innerText = colourArr[1];
blueDisplay.innerText = colourArr[2];
rgradSlider.value = rChange / 0.00001;
ggradSlider.value = gChange / 0.00001;
bgradSlider.value = bChange / 0.00001;
rgradDisplay.innerText = rChange / 0.00001;
ggradDisplay.innerText = gChange / 0.00001;
bgradDisplay.innerText = bChange / 0.00001;
particleSlider.value = iterations;
particleDisplay.innerText = iterations;

// hide and show
function hide(name) {
    document.getElementById(name).style.display = 'none';
    document.getElementById(name + 'Hidden').style.display = 'block';
    document.getElementById(name + 'Hidden').style.width = '30%';
}
function show(name) {
    document.getElementById(name).style.display = 'block';
    document.getElementById(name + 'Hidden').style.display = 'none';
}



window.addEventListener('resize', () => {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerWidth / 2;
    init();
    calculate();
})

// keyboard shortcut control
let mode = 0;
window.addEventListener('keypress', (e) => {
    if (e.key == 1) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: A value';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 1;
    } else if (e.key == 2) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: B value';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 2;
    } else if (e.key == 3) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: C value';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 3;
    } else if (e.key == 4) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: D value';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 4;
    } else if (e.key == 5) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: Red value';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 5;
    } else if (e.key == 6) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: Green value';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 6;
    } else if (e.key == 7) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: Blue value';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 7;
    } else if (e.key == 8) {
        document.getElementById('popup').classList.remove('run_animation');
        document.getElementById('popupMessage').innerText = 'changing: Particles count';
        setTimeout(() => { document.getElementById('popup').classList.add('run_animation') })
        mode = 8;
    } else if (e.key == 'a') {
        switch (mode) {
            case 1:
                if (a > 0) {
                    a -= 0.025;
                    aSlider.value = a;
                    aDisplay.innerText = a;
                    calculate();
                }
                break;
            case 2:
                if (b > 0) {
                    b -= 0.025;
                    bSlider.value = b;
                    bDisplay.innerText = b;
                    calculate();
                }
                break;
            case 3:
                if (c > -1) {
                    c -= 0.025;
                    cSlider.value = c;
                    cDisplay.innerText = c;
                    calculate();
                }
                break;
            case 4:
                if (d > -2) {
                    d -= 0.025;
                    dSlider.value = d;
                    dDisplay.innerText = d;
                    calculate();
                }
                break;
            case 5:
                if (colourArr[0] > 0) {
                    colourArr[0] -= 1;
                    redSlider.value = colourArr[0];
                    redDisplay.innerText = colourArr[0];
                    changedColour = colourArr.slice();
                    calculate();
                }
                break;
            case 6:
                if (colourArr[1] > 0) {
                    colourArr[1] -= 1;
                    greenSlider.value = colourArr[1];
                    greenDisplay.innerText = colourArr[1];
                    changedColour = colourArr.slice();
                    calculate();
                }
                break;
            case 7:
                if (colourArr[2] > 0) {
                    colourArr[2] -= 1;
                    redSlider.value = colourArr[2];
                    redDisplay.innerText = colourArr[2];
                    changedColour = colourArr.slice();
                    calculate();
                }
                break;
            case 8:
                if (iterations > 2000) {
                    iterations -= 10;
                    particleSlider.value = iterations;
                    particleDisplay.innerText = iterations;
                    calculate();
                }
                break;

        }
    } else if (e.key == 'd') {
        switch (mode) {
            case 1:
                if (a < 3) {
                    a += 0.025;
                    aSlider.value = a;
                    aDisplay.innerText = a;
                    calculate();
                }
                break;
            case 2:
                if (b < 3) {
                    b += 0.025;
                    bSlider.value = b;
                    bDisplay.innerText = b;
                    calculate();
                }
                break;
            case 3:
                if (c < 2) {
                    c += 0.025;
                    cSlider.value = c;
                    cDisplay.innerText = c;
                    calculate();
                }
                break;
            case 4:
                if (d < 1) {
                    d += 0.025;
                    dSlider.value = d;
                    dDisplay.innerText = d;
                    calculate();
                }
                break;
            case 5:
                if (colourArr[0] < 255) {
                    colourArr[0] += 1;
                    redSlider.value = colourArr[0];
                    redDisplay.innerText = colourArr[0];
                    changedColour = colourArr.slice();
                    calculate();
                }
                break;
            case 6:
                if (colourArr[1] < 255) {
                    colourArr[1] += 1;
                    greenSlider.value = colourArr[1];
                    greenDisplay.innerText = colourArr[1];
                    changedColour = colourArr.slice();
                    calculate();
                }
                break;
            case 7:
                if (colourArr[2] < 255) {
                    colourArr[2] += 1;
                    redSlider.value = colourArr[2];
                    redDisplay.innerText = colourArr[2];
                    changedColour = colourArr.slice();
                    calculate();
                }
                break;
            case 8:
                if (iterations < 200000) {
                    iterations += 10;
                    particleSlider.value = iterations;
                    particleDisplay.innerText = iterations;
                    calculate();
                }
                break;
        }
    }
})
