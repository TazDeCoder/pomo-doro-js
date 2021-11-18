"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Inputs
const inputWork = document.querySelector(".form__input--work");
const inputBreak = document.querySelector(".form__input--break");
const inputReverse = document.querySelector(".form__input--reverse");
const inputManual = document.querySelector(".form__input--manual");
// Buttons
const btnSubmit = document.querySelector(".form__btn--submit");
const btnStopTimer = document.querySelector(".btn--stop-timer");
// Labels
const labelContainer = document.querySelector(".container__label");
const labelTimer = document.querySelector(".clock__label--timer");
const labelCounter = document.querySelector(".clock__label--counter");
// Parents
const nav = document.querySelector(".nav");
const main = document.querySelector(".main");

////////////////////////////////////////////////
////// Timer Architecture
///////////////////////////////////////////////

let countDownTimer;

class Timer {
  counter = 0;

  constructor(type, mode, intervals) {
    this.type = type;
    this.mode = mode;
    [this.work, this.break] = intervals;
  }

  updateTimer(time) {
    let finishTime, startTime;
    const isReverse = this.type === "reverse" ? true : false;
    const isManual = this.mode === "manual" ? true : false;
    const isWork = this.work === +time ? true : false;
    if (isReverse) finishTime = +time;
    startTime = isReverse && isWork ? 0 : +time;
    const tick = function () {
      const min = String(Math.trunc(startTime / 60)).padStart(2, 0);
      const sec = String(Math.trunc(startTime % 60)).padStart(2, 0);
      labelTimer.textContent = `${min}:${sec}`;
      if (
        (!isReverse && startTime === -1) ||
        (isReverse && !isWork && startTime === -1) ||
        (isReverse && isWork && startTime === finishTime)
      ) {
        if (isWork) {
          ++this.counter;
          labelCounter.textContent = this.counter;
        }
        if (isManual && !isWork) alert(`Are You Ready?`);
        clearInterval(countDownTimer);
        labelContainer.textContent = !isWork ? "Work" : "Break";
        countDownTimer = !isWork
          ? this.updateTimer(this.work)
          : this.updateTimer(this.break);
      }
      startTime = isReverse && isWork ? ++startTime : --startTime;
    };
    tick();
    const timer = setInterval(tick.bind(this), 1000);
    return timer;
  }
}

////////////////////////////////////////////////
////// App UI Setup
///////////////////////////////////////////////

(() => init())();

function init() {
  // Reset conditions

  // Clean-up Ui
  labelContainer.textContent = "...";
  labelTimer.textContent = "00:00";
  inputWork.value = inputBreak.value = "";
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

const mainOberserver = new ResizeObserver(fadeNav);

function fadeNav(entries) {
  const [entry] = entries;
  if (
    entry.contentRect.width >= 820 ||
    window.screen.width === window.innerWidth
  )
    return main.classList.add("main--expand");
  main.classList.remove("main--expand");
}

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  const type = inputReverse.checked ? "reverse" : "normal";
  const mode = inputManual.checked ? "manual" : "auto";
  const intervals = [inputWork.value, inputBreak.value].map((ipt) => ipt * 60);
  const timer = new Timer(type, mode, intervals);
  if (countDownTimer) clearInterval(countDownTimer);
  countDownTimer = timer.updateTimer(timer.work);
  mainOberserver.observe(main);
  labelContainer.textContent = "Work";
  nav.classList.add("nav--hidden");
});

btnStopTimer.addEventListener("click", function () {
  if (countDownTimer) clearInterval(countDownTimer);
  mainOberserver.unobserve(main);
  nav.classList.remove("nav--hidden");
  main.classList.remove("main--expand");
  init();
});
