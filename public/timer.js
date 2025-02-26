const paragraphTimerText = document.querySelector('#timer-text');
const buttonStartTimer = document.querySelector('#start-timer');
const buttonStopTimer = document.querySelector('#pause-timer');
const buttonResetTimer = document.querySelector('#reset-timer');
const buttonSubmitTime = document.querySelector('#submit-time');

let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let timerId;

const setTimerText = () => {
  paragraphTimerText.textContent = `${minutes}:${seconds}:${milliseconds}`;
};

const startTimer = () => {
  timerId = setInterval(() => {
    milliseconds += 10;

    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    }

    if (milliseconds === 1000) {
      milliseconds = 0;
      seconds += 1;
    }

    setTimerText();
  }, 10);
};

const pauseTimer = () => {
  clearInterval(timerId);
};

const resetTimer = () => {
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  setTimerText();
};

const submitTime = () => {
  const confirm = window.confirm('Are you sure you want to submit your time?');
  if (confirm) {
    // TODO: Add submit logic
    pauseTimer();
    console.log('Submited!');
  }
};

buttonStartTimer.addEventListener('click', startTimer);
buttonStopTimer.addEventListener('click', pauseTimer);
buttonResetTimer.addEventListener('click', resetTimer);
buttonSubmitTime.addEventListener('click', submitTime);
