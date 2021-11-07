"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

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

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let countDownTimer, isWork;

const pomodoro = {
  counter: 0,
  intervals: {
    work: 0,
    break: 0,
  },
};

(() => init())();

function init() {
  // Reset conditions
  pomodoro.counter = 0;
  pomodoro.intervals.work = 0;
  pomodoro.intervals.break = 0;
  isWork = true;
  // Clean-up Ui
  labelContainer.textContent = "...";
  labelTimer.textContent = "00:00";
}

////////////////////////////////////////////////
////// App Logic
///////////////////////////////////////////////

function updateClock(time) {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === -1) {
      if (isWork) {
        ++pomodoro.counter;
        labelCounter.textContent = pomodoro.counter;
      }
      clearInterval(countDownTimer);
      isWork = !isWork;
      labelContainer.textContent = isWork ? "Work" : "Break";
      countDownTimer = isWork
        ? updateClock(pomodoro.intervals.work)
        : updateClock(pomodoro.intervals.break);
    }
    --time;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

btnStart.addEventListener("click", function () {
  pomodoro.intervals.work = +inputWorkTime.value * 60;
  pomodoro.intervals.break = +inputBreakTime.value * 60;
  if (countDownTimer) clearInterval(countDownTimer);
  countDownTimer = updateClock(pomodoro.intervals.work);
  labelContainer.textContent = "Work";
});

btnStop.addEventListener("click", function () {
  if (countDownTimer) clearInterval(countDownTimer);
  init();
});

// TEST DATA
pomodoro.intervals.work = 0.05 * 60;
pomodoro.intervals.break = 0.05 * 60;
if (countDownTimer) clearInterval(countDownTimer);
countDownTimer = updateClock(pomodoro.intervals.work);
labelContainer.textContent = "Work";
