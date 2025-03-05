'use strict';

const paragraphTimerText = document.querySelector('#timer-text');
const buttonStartTimer = document.querySelector('#start-timer');
const buttonStopTimer = document.querySelector('#pause-timer');
const buttonResetTimer = document.querySelector('#reset-timer');
const buttonSubmitTime = document.querySelector('#submit-time');

let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let timerId;

const timeString = `${hours}:${minutes}:${seconds}:${milliseconds}`;

// TODO: pad with 0s
const setTimerText = () => {
  paragraphTimerText.textContent = timeString;
};

const startTimer = () => {
  timerId = setInterval(() => {
    milliseconds += 10;

    if (minutes === 60) {
      minutes = 0;
      hours += 1;
    }

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
  hours = 0;
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  setTimerText();
};

const submitTime = async () => {
  const confirm = window.confirm('Are you sure you want to submit your time?');
  if (confirm) {
    pauseTimer();

    // TODO: fix error 500
    const payload = { time: timeString };
    console.log('Payload', payload);

    const response = await fetch('times', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedMessages = await response.json();
      console.log(updatedMessages);
    } else {
      console.log('failed to send message', response);
    }
  }
};

buttonStartTimer.addEventListener('click', startTimer);
buttonStopTimer.addEventListener('click', pauseTimer);
buttonResetTimer.addEventListener('click', resetTimer);
buttonSubmitTime.addEventListener('click', submitTime);
