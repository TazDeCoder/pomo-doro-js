"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Inputs
const inputWorkTime = document.querySelector(".timer__input--work");
const inputBreakTime = document.querySelector(".timer__input--break");
// Buttons
const btnStart = document.querySelector(".nav__btn--start");
const btnStop = document.querySelector(".container__btn--stop");
// Labels
const labelContainer = document.querySelector(".container__label");
const labelTimer = document.querySelector(".clock__label--timer");
const labelCounter = document.querySelector(".clock__label--counter");
// Parents
const header = document.querySelector(".header");
const main = document.querySelector(".main");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let countDownTimer, isWork;

const mainOberserver = new ResizeObserver(fadeHeader);

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
  inputWorkTime.value = inputBreakTime.value = "";
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

function fadeHeader(entries) {
  const [entry] = entries;
  if (
    entry.contentRect.width >= 820 ||
    window.screen.width === window.innerWidth
  )
    return main.classList.add("main--expand");
  main.classList.remove("main--expand");
}

btnStart.addEventListener("click", function () {
  pomodoro.intervals.work = +inputWorkTime.value * 60;
  pomodoro.intervals.break = +inputBreakTime.value * 60;
  if (!pomodoro.intervals.work || !pomodoro.intervals.break) return;
  if (countDownTimer) clearInterval(countDownTimer);
  countDownTimer = updateClock(pomodoro.intervals.work);
  labelContainer.textContent = "Work";
  header.classList.add("header--hidden");
  mainOberserver.observe(main);
});

btnStop.addEventListener("click", function () {
  if (countDownTimer) clearInterval(countDownTimer);
  mainOberserver.unobserve(main);
  header.classList.remove("header--hidden");
  main.classList.remove("main--expand");
  init();
});
