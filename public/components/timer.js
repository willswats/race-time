export class RaceTimer extends HTMLElement {
  constructor() {
    super();

    this.startDate = null;
    this.timePassed = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    this.paragraphTimerText = document.createElement('p');
    this.paragraphTimerText.textContent = '00:00:00:00';

    this.buttonStartTimer = document.createElement('button');
    this.buttonStartTimer.textContent = 'Start';

    this.buttonStopTimer = document.createElement('button');
    this.buttonStopTimer.textContent = 'Stop';

    this.buttonResetTimer = document.createElement('button');
    this.buttonResetTimer.textContent = 'Reset';

    this.buttonSubmitTime = document.createElement('button');
    this.buttonSubmitTime.textContent = 'Submit';

    this.buttonStartTimer.addEventListener('click', this.startTimer.bind(this));
    this.buttonStopTimer.addEventListener('click', this.stopTimer.bind(this));
    this.buttonResetTimer.addEventListener('click', this.resetTimer.bind(this));
    this.buttonSubmitTime.addEventListener('click', this.submitTime.bind(this));

    this.intervalId = window.setInterval(this.update.bind(this), 1);

    shadow.append(
      this.paragraphTimerText,
      this.buttonStartTimer,
      this.buttonStopTimer,
      this.buttonResetTimer,
      this.buttonSubmitTime,
    );
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  updateTime() {
    this.milliseconds = this.timePassed % 1000;
    this.seconds = Math.floor(this.timePassed / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);

    this.seconds = this.seconds % 60;
    this.minutes = this.minutes % 60;
  }

  setTimerText() {
    this.paragraphTimerText.textContent = `${this.padTo2Digits(this.hours)}:${this.padTo2Digits(this.minutes)}:${this.padTo2Digits(this.seconds)}:${this.padTo2Digits(this.milliseconds)}`;
  }

  update() {
    this.setTimerText();

    if (this.startDate) {
      this.timePassed = Date.now() - this.startDate;
      this.updateTime();
    }
  }

  startTimer() {
    this.resetTimer();
    this.startDate = Date.now();
  }

  stopTimer() {
    const confirm = window.confirm('Are you sure you want to stop your time?');
    if (confirm) {
      this.startDate = null;
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
      const payload = { time: this.timeString };

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
  }
}

customElements.define('race-timer', RaceTimer);
