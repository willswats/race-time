import { setSuccessColour, setErrorColour, customAlert } from '../utils.js';

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

    this.raceResults = [];
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

    this.buttonRecordTimer = document.createElement('button');
    this.buttonRecordTimer.textContent = 'Record';

    this.buttonStopTimer = document.createElement('button');
    this.buttonStopTimer.textContent = 'Stop';
    this.buttonStopTimer.hidden = true;

    this.buttonSubmitTime = document.createElement('button');
    this.buttonSubmitTime.textContent = 'Submit';
    this.buttonSubmitTime.hidden = true;

    this.buttonStartTimer.addEventListener(
      'click',
      this.startTimerButton.bind(this),
    );
    this.buttonRecordTimer.addEventListener(
      'click',
      this.recordTimerButton.bind(this),
    );
    this.buttonStopTimer.addEventListener(
      'click',
      this.stopTimerButton.bind(this),
    );
    this.buttonSubmitTime.addEventListener(
      'click',
      this.submitTimeButton.bind(this),
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

    this.olRaceResults = document.createElement('ol');
    this.olRaceResults.reversed = true;

    this.sectionRaceResultsButtons = document.createElement('section');
    this.sectionRaceResultsButtons.id = 'timer-results-buttons';
    this.sectionRaceResultsButtons.append(
      this.buttonRecordTimer,
      this.buttonSubmitTime,
    );

    this.paragraphFeedback = document.createElement('p');

    this.sectionRaceResults = document.createElement('section');
    this.sectionRaceResults.hidden = true;
    this.sectionRaceResults.id = 'timer-results';
    this.sectionRaceResults.append(
      this.sectionRaceResultsButtons,
      this.paragraphFeedback,
      this.olRaceResults,
    );

    this.shadow.append(link, this.sectionTimer, this.sectionRaceResults);

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
    this.buttonRecordTimer.hidden = false;
    this.buttonSubmitTime.hidden = true;
    this.sectionRaceResults.hidden = false;
    this.paragraphFeedback.textContent = '';
  }

  async startTimerButton() {
    if (this.raceResults.length > 0) {
      const confirm = await customAlert(
        this.shadow,
        'Are you sure you want to start a new timer? This will clear your previous results',
      );
      if (confirm) {
        this.clearRaceResults();
        this.startTimer();
      }
      return;
    }
    this.startTimer();
  }

  recordTimerButton() {
    // unshift instead of append so that race results can appear at the top of the ordered list
    this.raceResults.unshift(this.timeString);

    const record = document.createElement('li');
    record.textContent = this.timeString;
    this.olRaceResults.prepend(record);
  }

  stopTimer() {
    this.startDate = null;
    this.buttonStartTimer.hidden = false;
    this.buttonSubmitTime.hidden = false;
    this.buttonStopTimer.hidden = true;
    this.buttonRecordTimer.hidden = true;

    if (this.raceResults.length <= 0) {
      this.sectionRaceResults.hidden = true;
    }
  }

  async stopTimerButton() {
    const confirm = await customAlert(
      this.shadow,
      'Are you sure you want to stop your time?',
    );
    if (confirm) {
      this.stopTimer();
    }
  }

  clearRaceResults() {
    this.raceResults = [];
    this.olRaceResults.replaceChildren();
    this.sectionRaceResults.hidden = true;
  }

  resetTimer() {
    this.startDate = null;
    this.timePassed = 0;
    this.milliseconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }

  async submitTime() {
    // reverse the race results as unshift was used and not append
    const payload = { raceResults: this.raceResults.reverse() };

    const response = await fetch('/api/v1/race-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully submitted!';
    } else {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent =
        'Failed to send message (check console)!';
      console.log('Failed to send message', response);
    }
  }

  async submitTimeButton() {
    const confirm = await customAlert(
      this.alert,
      'Are you sure you want to submit your results?',
    );

    if (confirm) {
      this.submitTime();
      this.stopTimer();
    }
  }
}

customElements.define('race-timer', RaceTimer);
