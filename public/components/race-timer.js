import {
  createTimeString,
  customAlert,
  loadStyleSheet,
  loadGlobalStyleSheet,
  setSuccessColour,
  setErrorColour,
  getTimer,
  setTimerStartDate,
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
    this.paragraphFeedback.id = 'feedback';

    this.sectionTimer = document.createElement('section');
    this.sectionTimer.id = 'timer';
    this.sectionTimer.append(
      this.paragraphFeedback,
      this.sectionTimerTime,
      this.sectionTimerButtons,
    );

    this.showStartButton();
    await this.initTimer();

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

  showStartButton() {
    this.buttonStartTimer.hidden = false;
    this.buttonStopTimer.hidden = true;
    this.paragraphFeedback.textContent = 'Click start to start the timer!';
  }

  showStopButton() {
    this.buttonStartTimer.hidden = true;
    this.buttonStopTimer.hidden = false;
    this.paragraphFeedback.textContent = 'Click stop to stop the timer!';
  }

  async initTimer() {
    const response = await getTimer();
    if (response.ok) {
      const timer = await response.json();
      this.startDate = timer.timerStartDate;
      if (this.startDate !== null) {
        this.showStopButton();
      } else {
        this.showStartButton();
      }
    } else if (response.type === 'error') {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'No connection to server!';
    }
  }

  async startTimer() {
    const startDate = Date.now();

    const response = await setTimerStartDate(startDate);

    if (response.ok) {
      this.startDate = startDate;
      this.showStopButton();

      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully started the timer!';
    } else if (response.status === 403) {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent =
        "You role doesn't have permission to perform this action!";
    } else if (response.type === 'error') {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'No connection to server!';
    } else {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Failed to send message!';
    }
  }

  async stopTimer() {
    const startDate = null;
    const response = await setTimerStartDate(startDate);

    if (response.ok) {
      this.startDate = startDate;
      this.showStartButton();

      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully stopped the timer!';
    } else if (response.status === 403) {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent =
        "You role doesn't have permission to perform this action!";
    } else if (response.type === 'error') {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'No connection to server!';
    } else {
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
