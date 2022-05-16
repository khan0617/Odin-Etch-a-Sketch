// variables storing the size of the sketch grid itself.
let sketchWidth;
let sketchHeight;

// global variable storing the color being drawn on the sketch
let hoverColor = 'black';


// when the window is resized, make sure the grid adjusts accordingly
window.addEventListener('resize', () => {
    initHeightAndWidth();
    updateGridSize(document.getElementsByClassName('colorSlider')[0].value, false);
})

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

            // add hover listeners to change this div's color on mouseover
            newDiv.addEventListener('mouseover', hoverHandler);
            gridContainer.appendChild(newDiv);
        }
    }

    console.log(`boxWidth:${boxWidth}, boxHeight:${boxHeight}`);
}

// event handler for mouseover on any of the divs in the grid.
function hoverHandler(event){
    event.target.style.backgroundColor = hoverColor;
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
                gridContainer.appendChild(newDiv);
            }
        }
    }
}

initHeightAndWidth();
createGridBoxes();