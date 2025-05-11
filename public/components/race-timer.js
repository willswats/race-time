import {
  createTimeString,
  customAlert,
  loadStyleSheet,
  loadGlobalStyleSheet,
  getUserId,
  setSuccessColour,
  setErrorColour,
} from '../utils.js';

export class RaceTimer extends HTMLElement {
  constructor() {
    super();

    this.startDate = null;
    this.timeString = '00:00:00';
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });
    const globalSheet = await loadGlobalStyleSheet();
    const sheet = await loadStyleSheet(import.meta.resolve('./race-timer.css'));
    this.shadow.adoptedStyleSheets = [globalSheet, sheet];

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

    this.paragraphFeedback = document.createElement('p');

    this.sectionTimer = document.createElement('section');
    this.sectionTimer.id = 'timer';
    this.sectionTimer.append(
      this.sectionTimerTime,
      this.paragraphFeedback,
      this.sectionTimerButtons,
    );

    this.getTimer();

    this.shadow.append(this.sectionTimer);

    this.intervalId = window.setInterval(this.update.bind(this), 1);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  update() {
    this.setTimerText();

    if (this.startDate) {
      this.timeString = createTimeString(this.startDate);
    }
  }

  setTimerText() {
    this.paragraphTimerText.textContent = this.timeString;
  }

  async getTimer() {
    const response = await fetch(`/api/v1/timer`);
    if (response.ok) {
      const timer = await response.json();
      this.startDate = timer.timerStartDate;
      this.buttonStartTimer.hidden = true;
      this.buttonStopTimer.hidden = false;
    } else {
      console.log('failed to send message', response);
    }
  }

  async startTimer() {
    const startDate = Date.now();

    const payload = { startDate };
    const userId = getUserId();

    const response = await fetch(`/api/v1/timer?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(response);

    if (response.ok) {
      this.startDate = startDate;
      this.buttonStartTimer.hidden = true;
      this.buttonStopTimer.hidden = false;

      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully submitted!';
    } else if (response.status === 403) {
      console.log(response);
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent =
        "You role doesn't have permission to perform this action!";
    } else {
      console.log(response);
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Failed to send message!';
    }
  }

  async stopTimer() {
    const userId = getUserId();

    const response = await fetch(`/api/v1/timer?userId=${userId}`, {
      method: 'DELETE',
    });
    console.log(response);

    if (response.ok) {
      this.startDate = null;
      this.buttonStartTimer.hidden = false;
      this.buttonStopTimer.hidden = true;

      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully submitted!';
    } else if (response.status === 403) {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent =
        "You role doesn't have permission to perform this action!";
    } else {
      console.log(response);
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Failed to send message!';
    }
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
