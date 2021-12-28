"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const nav = document.querySelector(".nav");
const navForm = document.querySelector(".nav__form");
const contentMain = document.querySelector(".main__content");
const selectProfiles = document.querySelector(".item__select--profiles");
// Inputs
const inputWork = document.querySelector(".item__input--work");
const inputBreak = document.querySelector(".item__input--break");
const inputReverse = document.querySelector(".item__input--reverse");
const inputManual = document.querySelector(".item__input--manual");
// Labels
const labelContainer = document.querySelector(".container__label--display");
const labelTimer = document.querySelector(".item__label--timer");
const labelCounter = document.querySelector(".item__label--counter");
// Buttons
const btnStop = document.querySelector(".container__btn--stop");

////////////////////////////////////////////////
////// Timer Constructor
///////////////////////////////////////////////

class Timer {
  #counter = 0;

  constructor(intervals, reverse = false, manual = false) {
    this.reverse = reverse;
    this.manual = manual;
    [this.work, this.break] = intervals;
  }

  updateTimer(mode) {
    let finishTime, startTime;
    const isReverse = this.reverse;
    const isManual = this.manual;
    const isWork = this.work === +mode ? true : false;
    // Setup clock style
    if (isReverse) finishTime = +mode;
    startTime = isReverse && isWork ? 0 : +mode;
    labelContainer.textContent = !isWork ? "Work" : "Break";
    // Tick function for clock
    function tick() {
      const min = String(Math.trunc(startTime / 60)).padStart(2, 0);
      const sec = String(Math.trunc(startTime % 60)).padStart(2, 0);
      labelTimer.textContent = `${min}:${sec}`;
      if (
        (!isReverse && startTime === -1) ||
        (isReverse && !isWork && startTime === -1) ||
        (isReverse && isWork && startTime === finishTime)
      ) {
        if (isWork) {
          ++this.#counter;
          labelCounter.textContent = this.#counter;
        }
        if (isManual && !isWork) alert(`Are You Ready?`);
        clearInterval(currTimer);
        currTimer = !isWork
          ? this.updateTimer(this.work)
          : this.updateTimer(this.break);
      }
      startTime = isReverse && isWork ? ++startTime : --startTime;
    }
    tick();
    const timer = setInterval(tick.bind(this), 1000);
    return timer;
  }
}

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

let currTimer;

class App {
  #mainObserver = new ResizeObserver(this._expandMain);

  constructor() {
    this._init();
    // Add event handlers
    selectProfiles.addEventListener("change", this._toggleProfileComboBox);
    navForm.addEventListener("submit", this._submitForm.bind(this));
    btnStop.addEventListener("click", this._init.bind(this));
  }

  /////////////////////////////////////
  //////////// Handler functions

  _init() {
    if (currTimer) clearInterval(currTimer);
    // Reset form values
    inputWork.value = inputBreak.value = "";
    selectProfiles.value = "";
    // Reset container values
    labelContainer.textContent = "...";
    labelTimer.textContent = "00:00";
    labelCounter.textContent = "0";
    // Restore app to initial state
    nav.classList.remove("nav--hidden");
    contentMain.classList.remove("main__content--expand");
    this.#mainObserver.unobserve(contentMain);
  }

  _expandMain(entries) {
    const [entry] = entries;
    contentMain.classList.remove("main__content--expand");
    if (
      entry.contentRect.width >= 815 ||
      window.screen.width === window.innerWidth
    )
      contentMain.classList.add("main__content--expand");
  }

  _toggleProfileComboBox() {
    const val = selectProfiles.value;
    if (val === "") return;
    // Timer profiles
    if (val === "short") {
      inputWork.value = 25;
      inputBreak.value = 5;
      inputReverse.checked = false;
      inputManual.checked = true;
    }
    if (val === "long") {
      inputWork.value = 50;
      inputBreak.value = 10;
      inputReverse.checked = false;
      inputManual.checked = true;
    }
  }

  _submitForm(e) {
    e.preventDefault();
    // Retrieve data from input fields
    const workTime = +inputWork.value;
    const breakTime = +inputBreak.value;
    const reverse = inputReverse?.checked;
    const manual = inputManual?.checked;
    // Process data
    const intervals = [workTime, breakTime].map((ipt) => ipt * 60);
    const timer = new Timer(intervals, reverse, manual);
    if (currTimer) clearInterval(currTimer);
    currTimer = timer.updateTimer(timer.work);
    labelContainer.textContent = "Work";
    nav.classList.add("nav--hidden");
    this.#mainObserver.observe(contentMain);
  }
}

const app = new App();
