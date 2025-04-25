export class RaceTimer extends HTMLElement {
  constructor() {
    super();

    this.startDate = null;
    this.timePassed = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.timeString = '00:00:00:00';

    this.raceResults = [];
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

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
    this.buttonRecordTimer.hidden = true;

    this.buttonStopTimer = document.createElement('button');
    this.buttonStopTimer.textContent = 'Stop';

    this.buttonClearTimer = document.createElement('button');
    this.buttonClearTimer.textContent = 'Clear';

    this.buttonSubmitTime = document.createElement('button');
    this.buttonSubmitTime.textContent = 'Submit';

    this.olRaceResults = document.createElement('ol');
    this.olRaceResults.hidden = true;

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
    this.buttonClearTimer.addEventListener(
      'click',
      this.clearRaceResultsButton.bind(this),
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
      this.buttonRecordTimer,
      this.buttonStopTimer,
      this.buttonClearTimer,
      this.buttonSubmitTime,
    );

    this.sectionTimer = document.createElement('section');
    this.sectionTimer.id = 'timer';
    this.sectionTimer.append(this.sectionTimerTime, this.sectionTimerButtons);

    shadow.append(link, this.sectionTimer, this.olRaceResults);

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

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  updateTimeString() {
    this.milliseconds = this.timePassed % 1000;
    this.seconds = Math.floor(this.timePassed / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);

    this.seconds = this.seconds % 60;
    this.minutes = this.minutes % 60;

    this.timeString = `${this.padTo2Digits(this.hours)}:${this.padTo2Digits(this.minutes)}:${this.padTo2Digits(this.seconds)}:${this.padTo2Digits(this.milliseconds)}`;
  }

  setTimerText() {
    this.paragraphTimerText.textContent = this.timeString;
  }

  startTimer() {
    this.startDate = Date.now();
    this.buttonStartTimer.hidden = true;
    this.buttonRecordTimer.hidden = false;
  }

  startTimerButton() {
    if (this.raceResults.length > 0) {
      const confirm = window.confirm(
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
    this.raceResults.push(this.timeString);

    const record = document.createElement('li');
    record.textContent = this.timeString;
    this.olRaceResults.appendChild(record);
    this.olRaceResults.hidden = false;
  }

  stopTimer() {
    this.startDate = null;
    this.buttonStartTimer.hidden = false;
    this.buttonRecordTimer.hidden = true;
  }

  stopTimerButton() {
    const confirm = window.confirm('Are you sure you want to stop your time?');
    if (confirm) {
      this.stopTimer();
    }
  }

  clearRaceResults() {
    this.raceResults = [];
    this.olRaceResults.replaceChildren();
    this.olRaceResults.hidden = true;
  }

  clearRaceResultsButton() {
    const confirm = window.confirm(
      'Are you sure you want to clear your race results?',
    );
    if (confirm) {
      this.clearRaceResults();
      this.stopTimer();
    }
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
    const payload = { raceResults: this.raceResults };

    const response = await fetch('/api/v1/race-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedRaceResults = await response.json();
      console.log(updatedRaceResults);
    } else {
      console.log('failed to send message', response);
    }
  }

  submitTimeButton() {
    const confirm = window.confirm(
      'Are you sure you want to submit your results?',
    );

    if (confirm) {
      this.submitTime();
      this.stopTimer();
    }
  }
}

customElements.define('race-timer', RaceTimer);
