"use strict";

// Selecting HTML elemenets
// Inputs
const inputWorkTime = document.querySelector("#input--work");
const inputBreakTime = document.querySelector("#input--break");
// Buttons
const btnStart = document.querySelector("#btn--start");
const btnStop = document.querySelector("#btn--stop");
// Labels
const labelContainer = document.querySelector(".container__label");
const labelTimer = document.querySelector("#label--timer");
const labelCounter = document.querySelector("#label--counter");

// Initialise global variables
let clockTimer, workTime, breakTime, currCounter, isWork;

(() => init())();

function init() {
  // Reset conditions
  workTime = 0;
  breakTime = 0;
  currCounter = 0;
  isWork = true;
  // Clean-up Ui
  labelContainer.textContent = "...";
  labelTimer.textContent = "00:00";
}

function updateClock(time) {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === -1) {
      if (isWork) {
        ++currCounter;
        labelCounter.textContent = currCounter;
      }
      clearInterval(clockTimer);
      isWork = !isWork;
      labelContainer.textContent = isWork ? "Work" : "Break";
      clockTimer = isWork ? updateClock(workTime) : updateClock(breakTime);
    }
    --time;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

// Event Handlers
btnStart.addEventListener("click", function () {
  workTime = +inputWorkTime.value * 60;
  breakTime = +inputBreakTime.value * 60;
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = updateClock(workTime);
  labelContainer.textContent = "Work";
});
btnStop.addEventListener("click", function () {
  if (clockTimer) clearInterval(clockTimer);
  init();
});