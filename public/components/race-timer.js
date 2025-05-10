import { customAlert } from '../utils.js';

export class RaceTimer extends HTMLElement {
  constructor() {
    super();

    this.startDate = null;
    this.timePassed = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.timeString = '00:00:00';
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-timer.css'));

    this.paragraphTimerText = document.createElement('p');
    this.paragraphTimerText.textContent = this.timeString;

    this.buttonStartTimer = document.createElement('button');
    this.buttonStartTimer.textContent = 'Start';

    this.buttonStopTimer = document.createElement('button');
    this.buttonStopTimer.textContent = 'Stop';
    this.buttonStopTimer.hidden = true;

    this.buttonStartTimer.addEventListener('click', this.startTimer.bind(this));
    this.buttonStopTimer.addEventListener(
      'click',
      this.stopTimerButton.bind(this),
    );

    this.sectionTimerTime = document.createElement('section');
    this.sectionTimerTime.id = 'timer-time';
    this.sectionTimerTime.append(this.paragraphTimerText);

    this.sectionTimerButtons = document.createElement('section');
    this.sectionTimerButtons.id = 'timer-buttons';
    this.sectionTimerButtons.append(
      this.buttonStartTimer,
      this.buttonStopTimer,
    );

    this.sectionTimer = document.createElement('section');
    this.sectionTimer.id = 'timer';
    this.sectionTimer.append(this.sectionTimerTime, this.sectionTimerButtons);

    this.shadow.append(link, this.sectionTimer);

    this.intervalId = window.setInterval(this.update.bind(this), 1);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  update() {
    this.setTimerText();

    if (this.startDate) {
      this.timePassed = Date.now() - this.startDate;
      this.updateTimeString();
    }
  }

  padToDigits(digit, num) {
    return num.toString().padStart(digit, '0');
  }

  updateTimeString() {
    this.milliseconds = this.timePassed % 1000;
    this.seconds = Math.floor(this.timePassed / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);

    this.seconds = this.seconds % 60;
    this.minutes = this.minutes % 60;

    this.timeString = `${this.padToDigits(2, this.hours)}:${this.padToDigits(2, this.minutes)}:${this.padToDigits(2, this.seconds)}`;
  }

  setTimerText() {
    this.paragraphTimerText.textContent = this.timeString;
  }

  startTimer() {
    this.startDate = Date.now();
    this.buttonStartTimer.hidden = true;
    this.buttonStopTimer.hidden = false;
  }

  stopTimer() {
    this.startDate = null;
    this.buttonStartTimer.hidden = false;
    this.buttonStopTimer.hidden = true;
  }

  resetTimer() {
    this.startDate = null;
    this.timePassed = 0;
    this.milliseconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }

  async stopTimerButton() {
    const confirm = await customAlert(
      'Are you sure you want to stop the timer?',
    );
    if (confirm) {
      this.stopTimer();
    }
  }
}

customElements.define('race-timer', RaceTimer);
