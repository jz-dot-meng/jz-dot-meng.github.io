const selector = document.getElementById('selector');
let selectorArray = [];
let index = 0;

const _init = () => {
    // selector styling
    selector.style.width = '100%';
    selector.style.display = 'flex';
    selector.style.justifyContent = 'center';
    // left right select
    const leftSelect = document.createElement('div');
    leftSelect.style.width = '5%';
    leftSelect.style.cursor = 'pointer';
    leftSelect.innerHTML = '&lsaquo;';
    leftSelect.addEventListener('click', leftSelectTrigger)
    const rightSelect = document.createElement('div')
    rightSelect.style.width = '5%';
    rightSelect.innerHTML = '&rsaquo;';
    rightSelect.style.cursor = 'pointer';
    rightSelect.addEventListener('click', rightSelectTrigger)

    // selector display
    const selectorDisplay = document.createElement('div');
    selectorDisplay.style.width = '90%';
    selectorDisplay.style.textAlign = 'center';
    selectorDisplay.style.color = 'gray';
    selectorDisplay.id = 'selector-display';

    selector.appendChild(leftSelect);
    selector.appendChild(selectorDisplay);
    selector.appendChild(rightSelect)



    const string = selector.getAttribute('info');
    selectorArray = string.split(',').map((item) => item.trimStart())

    // set index 0
    selectorDisplay.innerHTML = selectorArray[index];
}
_init();

function leftSelectTrigger() {
    const externalLeftAction = selector.getAttribute('leftClick');
    if (index > 0) {
        index--;
    } else {
        index = selectorArray.length - 1;
    }
    document.getElementById('selector-display').innerHTML = selectorArray[index];
    (new Function(`return ${externalLeftAction}`))();
}

function rightSelectTrigger() {
    const externalRightAction = selector.getAttribute('rightClick');
    index++;
    index = index % selectorArray.length;
    document.getElementById('selector-display').innerHTML = selectorArray[index];
    (new Function(`return ${externalRightAction}`))();
}