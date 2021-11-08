"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Inputs
const inputWorkTime = document.querySelector(".timer__input--work");
const inputBreakTime = document.querySelector(".timer__input--break");
const inputReverse = document.querySelector(".timer__input--reverse");
// Buttons
const btnStart = document.querySelector(".nav__btn--start");
const btnStop = document.querySelector(".container__btn--stop");
// Labels
const labelContainer = document.querySelector(".container__label");
const labelTimer = document.querySelector(".clock__label--timer");
const labelCounter = document.querySelector(".clock__label--counter");
// Parents
const nav = document.querySelector(".nav");
const main = document.querySelector(".main");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let countDownTimer, isWork, isReverse;

const mainOberserver = new ResizeObserver(fadeNav);

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
  time = isReverse && isWork ? 0 : time;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (
      (!isReverse && time === -1) ||
      (isReverse && !isWork && time <= -1) ||
      (isReverse && isWork && time === 61)
    ) {
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
    time = isReverse && isWork ? ++time : --time;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

function fadeNav(entries) {
  const [entry] = entries;
  if (
    entry.contentRect.width >= 820 ||
    window.screen.width === window.innerWidth
  )
    return main.classList.add("main--expand");
  main.classList.remove("main--expand");
}

btnStart.addEventListener("click", function () {
  if (!+inputWorkTime.value || !+inputBreakTime.value) return;
  pomodoro.intervals.work = +inputWorkTime.value * 60;
  pomodoro.intervals.break = +inputBreakTime.value * 60;
  isReverse = inputReverse.value ? true : false;
  if (countDownTimer) clearInterval(countDownTimer);
  countDownTimer = updateClock(pomodoro.intervals.work);
  labelContainer.textContent = "Work";
  nav.classList.add("nav--hidden");
  mainOberserver.observe(main);
});

btnStop.addEventListener("click", function () {
  if (countDownTimer) clearInterval(countDownTimer);
  mainOberserver.unobserve(main);
  nav.classList.remove("nav--hidden");
  main.classList.remove("main--expand");
  init();
});
