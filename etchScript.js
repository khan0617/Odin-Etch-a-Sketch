// variables storing the size of the sketch grid itself.
let sketchWidth;
let sketchHeight;

// global variable storing the color being drawn on the sketch
let hoverColor = 'black';

// determines if we want incremental darkening mode
// basically, if we hover of the same square multiple times, it should become dark until it's black.
let darkeningMode = false;

// determines if we need to erase the squares or not on hover.
let eraseMode = false;


// determines if each div needs to have its border drawn or not
let drawGridLines = true;

function updateGridLines(){
    drawGridLines = !drawGridLines;
    let squares = document.querySelectorAll('.gridDiv');
    squares.forEach(element => {
        if(drawGridLines){
            element.style.border = '1px solid black';;
        }
        else{
            element.style.border = '0';
        }
    });
}

function updateEraseMode(){
    eraseMode = !eraseMode;
}

function updateDarkeningMode(){
    darkeningMode = !darkeningMode;
    if(darkeningMode){
        clearGrid();
    }
}

// when the window is resized, make sure the grid adjusts accordingly
window.addEventListener('resize', () => {
    initHeightAndWidth();
    updateGridSize(document.getElementsByClassName('colorSlider')[0].value, false);
})

function initHeightAndWidth(){
    let gridContainer = document.querySelector('.gridContainer');

    sketchWidth = Math.max(parseInt(gridContainer.style.width), gridContainer.offsetWidth);
    sketchHeight = Math.max(parseInt(gridContainer.style.height), gridContainer.offsetHeight);

    // DEBUGGING:
    console.log(`grid width: ${sketchWidth}, grid height: ${sketchHeight}`);
}


// function from stackoverflow to convert an rgb(x, y, z) value to a 'FFFFFF' string
// to use this to set a background color, add a "#" at the start first!
function convertRGBToHex(rgbVal) {
    var parts = rgbVal.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete (parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return parts.join('').toUpperCase();
}

// Function that's called whenever the slider is changed. 
// Re-sizes the grid and updates the size label.
function updateSliderValue(value){
    let p = document.getElementsByClassName('gridSize')[0];
    p.textContent = `${value}x${value}`;
    updateGridSize(value);
}


// function to change our 
function updateColorValue(color){
    hoverColor = color;
}


// function to dynamically create all the divs on the etch-a-sketch grid
function createGridBoxes(){
    let sliderValue = document.getElementsByClassName('colorSlider')[0].value;
    let gridContainer = document.getElementsByClassName('gridContainer')[0];
    let boxWidth = sketchWidth / sliderValue;
    let boxHeight = sketchHeight / sliderValue;

    // create each new div to add it to the etch-a-sketch container
    for(let i = 0; i < sliderValue; i++){
        for(let j = 0; j < sliderValue; j++){
            let newDiv = document.createElement('div');
            newDiv.style.width = boxWidth + "px";
            newDiv.style.height = boxHeight + "px";
            newDiv.classList.add('gridDiv');
            if(drawGridLines){
                newDiv.style.border = '1px solid black';
            }
            else{
                newDiv.style.border = '0';
            }

            // add hover listeners to change this div's color on mouseover
            newDiv.addEventListener('mouseover', hoverHandler);
            gridContainer.appendChild(newDiv);
        }
    }

    console.log(`boxWidth:${boxWidth}, boxHeight:${boxHeight}`);
}

// event handler for mouseover on any of the divs in the grid.
function hoverHandler(event){
    if(eraseMode){
        event.target.style.backgroundColor = null;
    }
    else{
        if(darkeningMode){
            let col = window.getComputedStyle(event.target ,null).getPropertyValue('background-color'); // read the background color of the square currently
            console.log(`col: ${col}`);
            // the section below works by changing the black level of each square incrementally.
            // We start at #c8c8c8 (or rgb(200, 200, 200) and decrease by 50 rgb values every time)
            // this can be achieved by subtracing #323232 from the hex value until we hit 0x0
            if(col == '' || col == undefined || col == 'rgba(0, 0, 0, 0)'){
                col = '#c8c8c8';
                event.target.style.backgroundColor = col;
            }
            else{
                let hexCol = convertRGBToHex(col);
                hexCol = Number("0x" + hexCol);
                hexCol -= 0x323232;
                hexCol = Math.max(0x0, hexCol);

                // make sure hexCol is a 6 digit hex number with a #
                if(hexCol == 0){
                    hexCol = "#000000";
                }
                else{
                    hexCol = "#" + hexCol.toString(16);
                }
                event.target.style.backgroundColor = hexCol;
            }
        }
        else{
            event.target.style.backgroundColor = hoverColor;
        }
        
    }
}

// function that resets the grid to zero, removing all drawn stuff from the sketch window
function clearGrid(){
    let squares = document.querySelectorAll('.gridDiv');
    squares.forEach(element => {
        element.style.removeProperty('background-color');
    });
}

// change the size of the gridDiv's to match the slider's value
// value is a number denoting grid size: options are 25, 50, 75 from the slider.
function updateGridSize(value, clear = true){
    let boxWidth = sketchWidth / value;
    let boxHeight = sketchHeight / value;
    let squares = document.querySelectorAll('.gridDiv');
    let gridContainer = document.querySelector('.gridContainer');
    let numBoxesPerRow = Math.sqrt(squares.length); // number of divs per row before changing anything

    if(clear){
        clearGrid();
    }

    // we'll need to remove the extra divs in this case
    if(value < numBoxesPerRow){
        for(let i = 0; i < numBoxesPerRow ** 2; i++){
            let div = squares[i];

            // update old divs first
            if(i < value ** 2){
                div.style.width = boxWidth + 'px';
                div.style.height = boxHeight + 'px';
            }
    
            // remove all the extra divs if necessary
            else{
                gridContainer.removeChild(div);
            }
        }
    }

    // need to add extra divs in this case
    else{
        for(let i = 0; i < value ** 2; i++){

            // update old divs first
            if(i < numBoxesPerRow ** 2){
                let div = squares[i];
                div.style.width = boxWidth + 'px';
                div.style.height = boxHeight + 'px';
            }
    
            // add new divs in
            else{
                let newDiv = document.createElement('div');
                newDiv.style.width = boxWidth + "px";
                newDiv.style.height = boxHeight + "px";
                newDiv.classList.add('gridDiv');
                newDiv.addEventListener('mouseover', hoverHandler);
                if(drawGridLines){
                    newDiv.style.border = '1px solid black';
                }
                else{
                    newDiv.style.border = '0';
                }
                gridContainer.appendChild(newDiv);
            }
        }
    }
}


// start the program and start the grid
initHeightAndWidth();
createGridBoxes();