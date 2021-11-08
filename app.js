"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Inputs
const inputWork = document.querySelector(".timer__input--work");
const inputBreak = document.querySelector(".timer__input--break");
const inputReverse = document.querySelector(".timer__input--reverse");
const inputManual = document.querySelector(".timer__input--manual");
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

let countDownTimer, isWork, isReverse, isManual;

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
  inputWork.value = inputBreak.value = "";
}

////////////////////////////////////////////////
////// App Logic
///////////////////////////////////////////////

function updateClock(time) {
  let finishTime, startTime;
  if (isReverse) finishTime = time;
  startTime = isReverse && isWork ? 0 : time;
  const tick = function () {
    const min = String(Math.trunc(startTime / 60)).padStart(2, 0);
    const sec = String(Math.trunc(startTime % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (
      (!isReverse && startTime === -1) ||
      (isReverse && !isWork && startTime === -1) ||
      (isReverse && isWork && startTime === finishTime + 1)
    ) {
      if (isWork) {
        ++pomodoro.counter;
        labelCounter.textContent = pomodoro.counter;
      }
      if (isManual && !isWork) alert(`Are You Ready?`);
      clearInterval(countDownTimer);
      isWork = !isWork;
      labelContainer.textContent = isWork ? "Work" : "Break";
      countDownTimer = isWork
        ? updateClock(pomodoro.intervals.work)
        : updateClock(pomodoro.intervals.break);
    }
    startTime = isReverse && isWork ? ++startTime : --startTime;
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
  if (!(+inputWork.value && +inputBreak.value)) return;
  pomodoro.intervals.work = +inputWork.value * 60;
  pomodoro.intervals.break = +inputBreak.value * 60;
  isReverse = inputReverse.checked ? true : false;
  isManual = inputManual.checked ? true : false;
  if (countDownTimer) clearInterval(countDownTimer);
  countDownTimer = updateClock(pomodoro.intervals.work);
  mainOberserver.observe(main);
  labelContainer.textContent = "Work";
  nav.classList.add("nav--hidden");
});

btnStop.addEventListener("click", function () {
  if (countDownTimer) clearInterval(countDownTimer);
  mainOberserver.unobserve(main);
  nav.classList.remove("nav--hidden");
  main.classList.remove("main--expand");
  init();
});
