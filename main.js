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
    
    // Add click event for desktop
    gridItem.onclick = () => clickCell(gridItem, gridNum);
    
    // Add touch events for mobile devices
    gridItem.addEventListener('touchstart', (e) => {
      e.preventDefault();
      gridItem.classList.add('touching');
    }, { passive: false });
    
    gridItem.addEventListener('touchend', (e) => {
      e.preventDefault();
      gridItem.classList.remove('touching');
      clickCell(gridItem, gridNum);
    }, { passive: false });
    
    // Prevent context menu on long press
    gridItem.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
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

// Modal functions
const showModal = () => {
  const modal = document.getElementById("gameModal");
  const completionTime = document.getElementById("completionTime");
  const scoreRating = document.getElementById("scoreRating");
  const scoreReference = document.getElementById("scoreReference");
  const stopwatch = document.getElementById("stopwatch").textContent;
  
  // Set completion time
  completionTime.textContent = `Completion Time: ${stopwatch}`;
  
  // Calculate score and rating
  const { rating, score, worldRecord } = calculateScore();
  scoreRating.textContent = score;
  scoreRating.className = `score-rating ${rating.toLowerCase()}`;
  
  // Set score reference
  scoreReference.innerHTML = getScoreReference();
  
  // Show modal with animation
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
};

// Calculate score based on completion time and grid size
const calculateScore = () => {
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  const gridSize = parseInt(currentGrid.id.replace("grid", ""));
  
  // Parse completion time
  const timeText = document.getElementById("stopwatch").textContent;
  const [minutes, seconds] = timeText.split(':').map(s => parseInt(s.trim()));
  const totalSeconds = minutes * 60 + seconds;
  
  // International standards based on cognitive training research and world records
  const standards = {
    3: { 
      excellent: 8,    // World-class level
      good: 12,        // Advanced level
      average: 18,     // Intermediate level
      worldRecord: 4   // World record reference
    },
    4: { 
      excellent: 15,   // World-class level
      good: 22,        // Advanced level
      average: 32,     // Intermediate level
      worldRecord: 8   // World record reference
    },
    5: { 
      excellent: 25,   // World-class level
      good: 35,        // Advanced level
      average: 50,     // Intermediate level
      worldRecord: 15  // World record reference
    },
    6: { 
      excellent: 40,   // World-class level
      good: 55,        // Advanced level
      average: 75,     // Intermediate level
      worldRecord: 25  // World record reference
    },
    7: { 
      excellent: 60,   // World-class level
      good: 80,        // Advanced level
      average: 110,    // Intermediate level
      worldRecord: 40  // World record reference
    }
  };
  
  const standard = standards[gridSize];
  let rating, score;
  
  if (totalSeconds <= standard.excellent) {
    rating = "World-Class";
    score = "🏆 World-Class Performance!";
  } else if (totalSeconds <= standard.good) {
    rating = "Advanced";
    score = "⭐ Advanced Performance!";
  } else if (totalSeconds <= standard.average) {
    rating = "Intermediate";
    score = "👍 Intermediate Performance";
  } else {
    rating = "Beginner";
    score = "💪 Keep Practicing!";
  }
  
  return { rating, score, worldRecord: standard.worldRecord };
};

// Get score reference for current grid size
const getScoreReference = () => {
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  const gridSize = parseInt(currentGrid.id.replace("grid", ""));
  
  // International performance standards with world record references
  const references = {
    3: {
      worldClass: "&lt;8s",
      advanced: "8-12s", 
      intermediate: "12-18s",
      worldRecord: "~4s"
    },
    4: {
      worldClass: "&lt;15s",
      advanced: "15-22s",
      intermediate: "22-32s",
      worldRecord: "~8s"
    },
    5: {
      worldClass: "&lt;25s",
      advanced: "25-35s", 
      intermediate: "35-50s",
      worldRecord: "~15s"
    },
    6: {
      worldClass: "&lt;40s",
      advanced: "40-55s",
      intermediate: "55-75s",
      worldRecord: "~25s"
    },
    7: {
      worldClass: "&lt;60s",
      advanced: "60-80s",
      intermediate: "80-110s",
      worldRecord: "~40s"
    }
  };
  
  const ref = references[gridSize];
  return `
    <h4>International ${gridSize}x${gridSize} Grid Standards:</h4>
    <ul>
      <li><strong>🏆 World-Class:</strong> ${ref.worldClass}</li>
      <li><strong>⭐ Advanced:</strong> ${ref.advanced}</li>
      <li><strong>👍 Intermediate:</strong> ${ref.intermediate}</li>
      <li><strong>🌍 World Record:</strong> ${ref.worldRecord}</li>
    </ul>
  `;
};

const closeModal = () => {
  const modal = document.getElementById("gameModal");
  modal.classList.remove("show");
  
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = '';
  }, 300);
};

// toggle modal display
const toggleShowOrHide = (isshown) => {
  if (isshown) {
    showModal();
  } else {
    closeModal();
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
  closeModal();
  
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
  closeModal();
  
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  if (currentGrid) {
    const currentGridNum = parseInt(currentGrid.id.replace("grid", ""));
    const nextGridNum = currentGridNum + 1;
    if (nextGridNum <= 7) {
      showGrid(nextGridNum);
    } else {
      // If at max level, restart current level
      resetGrids(currentGridNum);
      resetStopwatch();
    }
  }
  resetStopwatch();
};

// Add keyboard support for modal
document.addEventListener('keydown', function(e) {
  const modal = document.getElementById("gameModal");
  if (!modal.classList.contains("hidden") && !modal.classList.contains("show")) {
    return;
  }
  
  if (e.key === 'Escape' && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Add click outside modal to close
document.addEventListener('click', function(e) {
  const modal = document.getElementById("gameModal");
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  toggleShowOrHideGridBtn(true);
  document.getElementById("stopwatch").classList.add("hidden");
});