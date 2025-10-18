// get a random number
const getRandomNum = (gridNum) => {
  const indexOfNumArr = Math.floor(Math.random() * gridNum);
  return indexOfNumArr + 1;
};

const createGridItems = (gridNum) => {
  const grid = document.getElementById("grid" + gridNum);
  grid.innerHTML = '';
  
  for (let i = 0; i < gridNum * gridNum; i++) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.setAttribute('role', 'gridcell');
    gridItem.setAttribute('tabindex', '0');
    gridItem.setAttribute('aria-label', `Number ${i + 1} cell`);
    gridItem.onclick = () => clickCell(gridItem, gridNum);
    // Add keyboard support for accessibility
    gridItem.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickCell(gridItem, gridNum);
      }
    };
    grid.appendChild(gridItem);
  }
};

// put the different random numbers into each grid cell
const setDiffRandomNumToEachCell = (gridNum) => {
  let elem = document.getElementById("grid" + gridNum);
  let elements = elem.getElementsByClassName("grid-item");
  
  let numbers = [];
  for (let i = 1; i <= gridNum * gridNum; i++) {
    numbers.push(i);
  }
  
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerHTML = numbers[i];
    elements[i].setAttribute('aria-label', `Number ${numbers[i]} cell`);
  }
};

const resetGrids = (gridNum) => {
  createGridItems(gridNum);
  setDiffRandomNumToEachCell(gridNum);
  index(false, true);
  toggleShowOrHide(false);
};

const showGrid = (gridNum) => {
  document.getElementById("stopwatch").classList.remove("hidden");

  resetStopwatch();

  document.getElementById("grid3").classList.add("hidden");
  document.getElementById("grid4").classList.add("hidden");
  document.getElementById("grid5").classList.add("hidden");
  document.getElementById("grid6").classList.add("hidden");
  document.getElementById("grid7").classList.add("hidden");

  resetGrids(gridNum);
  document.getElementById("grid" + gridNum).classList.remove("hidden");

  toggleShowOrHideGridBtn(false);

  stopwatchElem.innerHTML = `${get2digits(minutes)} : ${get2digits(seconds)}`;
};

let global = {
  minutes: 0,
  seconds: 0,
  intervalID: 0,
  stopwatchElem: document.getElementById("stopwatch"),
};

let minutes = 0;
let seconds = 0;
const get2digits = (num) => {
  num = Math.floor(num);
  if (num < 10) {
    return "0" + num;
  }
  return num;
};

let intervalID;
let stopwatchElem = document.getElementById("stopwatch");
const stopwatch = (cellNum, gridNum) => {
  const timeRun = () => {
    if (seconds < 60) {
      seconds = seconds + 1;
    }
    if (seconds === 60) {
      minutes = minutes + 1;
      seconds = 0;
    }
    stopwatchElem.innerHTML = `${get2digits(minutes)} : ${get2digits(seconds)}`;
  };
  if (cellNum === 1) {
    intervalID = setInterval(timeRun, 1000);
  }
  if (cellNum === gridNum * gridNum) {
    clearInterval(intervalID);
  }
};

// press each grid cell in numerical order
// let i = 1;
const clickCell = (elem, gridNum) => {
  let cellNum = parseInt(elem.innerText);
  stopwatch(cellNum, gridNum);
  if (index(false, false) === cellNum) {
    index(true, false);
    elem.style.backgroundColor = "#e6d7c3";
    toggleShowOrHideGridBtn(false);
  }
  if (index(false, false) === gridNum * gridNum + 1) {
    toggleShowOrHide(true);
  }
};

// ** set the gloable var i in block (closure)
const index = (() => {
  let i = 1;
  return (isIncrease, isReset) => {
    if (isIncrease) {
      return i++;
    }
    if (isReset) {
      i = 1;
    }
    return i;
  };
})();

// toggle remove class 'hidden'
const toggleShowOrHideGridBtn = (isShown) => {};
// toggle 'div#result'
const toggleShowOrHide = (isshown) => {
  if (isshown) {
    document.getElementById("done").classList.remove("hidden");
    document.getElementById("restart").classList.remove("hidden");
    document.getElementById("next").classList.remove("hidden");
  } else {
    document.getElementById("done").classList.add("hidden");
    document.getElementById("restart").classList.add("hidden");
    document.getElementById("next").classList.add("hidden");
  }
};
const toggleShowOrHideGrids = (isshown) => {};

// reset stopwatch
const resetStopwatch = () => {
  seconds = 0;
  minutes = 0;
  stopwatchElem.innerHTML = `${get2digits(minutes)} : ${get2digits(seconds)}`;
};

// restart game
const reset = () => {
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  if (currentGrid) {
    const gridNum = parseInt(currentGrid.id.replace("grid", ""));
    resetGrids(gridNum);
  }
  resetStopwatch();
};

// next level
const nextLevel = () => {
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  if (currentGrid) {
    const currentGridNum = parseInt(currentGrid.id.replace("grid", ""));
    const nextGridNum = currentGridNum + 1;
    if (nextGridNum <= 7) {
      showGrid(nextGridNum);
    }
  }
  resetStopwatch();
};

document.addEventListener('DOMContentLoaded', function() {
  toggleShowOrHideGridBtn(true);
  document.getElementById("stopwatch").classList.add("hidden");
});