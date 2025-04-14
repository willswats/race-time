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

    this.results = [];
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
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

    this.olResults = document.createElement('ol');

    this.buttonStartTimer.addEventListener('click', this.startTimer.bind(this));
    this.buttonRecordTimer.addEventListener(
      'click',
      this.recordTimer.bind(this),
    );
    this.buttonStopTimer.addEventListener('click', this.stopTimer.bind(this));
    this.buttonClearTimer.addEventListener('click', this.clearTimer.bind(this));
    this.buttonSubmitTime.addEventListener('click', this.submitTime.bind(this));

    this.intervalId = window.setInterval(this.update.bind(this), 1);

    shadow.append(
      this.paragraphTimerText,
      this.buttonStartTimer,
      this.buttonRecordTimer,
      this.buttonStopTimer,
      this.buttonClearTimer,
      this.buttonSubmitTime,
      this.olResults,
    );
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

  recordTimer() {
    this.results.push(this.timeString);

    const record = document.createElement('li');
    record.textContent = this.timeString;
    this.olResults.appendChild(record);
  }

  stopTimer() {
    const confirm = window.confirm('Are you sure you want to stop your time?');
    if (confirm) {
      this.startDate = null;
      this.buttonStartTimer.hidden = false;
      this.buttonRecordTimer.hidden = true;
    }
  }

  clearTimer() {
    const confirm = window.confirm(
      'Are you sure you want to clear your race results?',
    );
    if (confirm) {
      this.results = [];
      this.olResults.replaceChildren();
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
    const confirm = window.confirm(
      'Are you sure you want to submit your time?',
    );

    if (confirm) {
      const payload = { results: this.results };

      const response = await fetch('/results', {
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
  }
}

customElements.define('race-timer', RaceTimer);
