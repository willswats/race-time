export class RaceTimer extends HTMLElement {
  constructor() {
    super();

    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.timeString = '';
    this.timerId = null;

    this.paragraphTimerText = null;
    this.buttonStartTimer = null;
    this.buttonStopTimer = null;
    this.buttonResetTimer = null;
    this.buttonSubmitTime = null;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    this.paragraphTimerText = document.createElement('p');
    this.paragraphTimerText.textContent = this.timeString;

    this.buttonStartTimer = document.createElement('button');
    this.buttonStartTimer.textContent = 'Start';

    this.buttonStopTimer = document.createElement('button');
    this.buttonStopTimer.textContent = 'Stop';

    this.buttonResetTimer = document.createElement('button');
    this.buttonResetTimer.textContent = 'Reset';

    this.buttonSubmitTime = document.createElement('button');
    this.buttonSubmitTime.textContent = 'Submit';

    this.buttonStartTimer.addEventListener('click', this.startTimer.bind(this));
    this.buttonStopTimer.addEventListener('click', this.pauseTimer.bind(this));
    this.buttonResetTimer.addEventListener('click', this.resetTimer.bind(this));
    this.buttonSubmitTime.addEventListener('click', this.submitTime.bind(this));

    this.intervalID = window.setInterval(this.update.bind(this), 1000);

    shadow.append(
      this.paragraphTimerText,
      this.buttonStartTimer,
      this.buttonStopTimer,
      this.buttonResetTimer,
      this.buttonSubmitTime,
    );
  }

  disconnectedCallback() {
    this.intervalID = window.clearInterval(this.intervalID);
  }

  updateTimeString() {
    this.timeString = `${this.hours}:${this.minutes}:${this.seconds}:${this.milliseconds}`;
  }

  setTimerText() {
    this.updateTimeString();
    this.paragraphTimerText.textContent = this.timeString;
  }

  update() {
    // TODO: use this to set the time on the ui
    console.log('update!');
  }

  startTimer() {
    // TODO: make this set the date / work out the time that has passed since this was pressed
    this.timerId = setInterval(() => {
      this.milliseconds += 10;

      if (this.minutes === 60) {
        this.minutes = 0;
        this.hours += 1;
      }

      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes += 1;
      }

      if (this.milliseconds === 1000) {
        this.milliseconds = 0;
        this.seconds += 1;
      }

      this.setTimerText();
    }, 10);
  }

  pauseTimer() {
    clearInterval(this.timerId);
  }

  resetTimer() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.setTimerText();
  }

  async submitTime() {
    const confirm = window.confirm(
      'Are you sure you want to submit your time?',
    );
    if (confirm) {
      this.pauseTimer();

      const payload = { time: this.timeString };
      console.log('Sending payload', payload);

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
