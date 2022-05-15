// variables storing the size of the sketch grid itself.
let sketchWidth;
let sketchHeight;

function initHeightAndWidth(){
    let gridContainer = document.getElementsByClassName('gridContainer')[0];
    sketchWidth = gridContainer.offsetWidth;
    sketchHeight = gridContainer.offsetHeight;

    // weird thing on chrome, width is zero sometimes
    if(sketchWidth == 0){
        sketchWidth = sketchHeight;
    }

    // DEBUGGING:
    console.log(`grid width: ${sketchWidth}, grid height: ${sketchHeight}`);
}

// Function that's called whenever the slider is changed. 
// Re-sizes the grid and updates the size label.
function updateSliderValue(value){
    let p = document.getElementsByClassName('gridSize')[0];
    p.textContent = `${value}x${value}`;
    updateGridSize(value);
}


// function to dynamically create all the divs on the etch-a-sketch grid
function createGridBoxes(){
    let sliderValue = document.getElementsByClassName('slider')[0].value;
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

            // add hover listeners to change this div's color on mouseover
            newDiv.addEventListener('mouseover', () => {
                newDiv.style.backgroundColor = 'black';
            });

            gridContainer.appendChild(newDiv);
        }
    }

    console.log(`boxWidth:${boxWidth}, boxHeight:${boxHeight}`);
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
function updateGridSize(value){
    let boxWidth = sketchWidth / value;
    let boxHeight = sketchHeight / value;
    let squares = document.querySelectorAll('.gridDiv');
    let numBoxesPerRow = Math.sqrt(squares.length); // number of divs per row before changing anything

    console.log(`Number of boxes per row: ${}`)

    squares.forEach(element => {
        element.style.width = boxWidth + 'px';
        element.style.height = boxHeight + 'px';
    });

    clearGrid();
}

initHeightAndWidth();
createGridBoxes();