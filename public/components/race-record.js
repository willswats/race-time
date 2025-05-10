import { setSuccessColour, setErrorColour, customAlert } from '../utils.js';

export class RaceRecord extends HTMLElement {
  constructor() {
    super();
    this.timer = document.querySelector('race-timer');
    this.raceResults = [];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-record.css'));

    this.buttonRecordTimer = document.createElement('button');
    this.buttonRecordTimer.textContent = 'Record';

    this.buttonSubmitTime = document.createElement('button');
    this.buttonSubmitTime.textContent = 'Submit';

    this.buttonRecordTimer.addEventListener(
      'click',
      this.recordTimerButton.bind(this),
    );
    this.buttonSubmitTime.addEventListener(
      'click',
      this.submitTimeButton.bind(this),
    );

    this.olRaceResults = document.createElement('ol');
    this.olRaceResults.reversed = true;

    this.sectionRaceResultsButtons = document.createElement('section');
    this.sectionRaceResultsButtons.id = 'timer-results-buttons';
    this.sectionRaceResultsButtons.append(
      this.buttonRecordTimer,
      this.buttonSubmitTime,
    );

    this.paragraphFeedback = document.createElement('p');

    this.sectionRaceResultsList = document.createElement('section');
    this.sectionRaceResultsList.id = 'timer-results-list';
    this.sectionRaceResultsList.append(
      this.sectionRaceResultsButtons,
      this.paragraphFeedback,
      this.olRaceResults,
    );

    this.sectionRaceResults = document.createElement('section');
    this.sectionRaceResults.id = 'timer-results';
    this.sectionRaceResults.append(this.sectionRaceResultsList);

    this.shadow.append(link, this.sectionRaceResults);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  recordTimerButton() {
    // unshift instead of append so that race results can appear at the top of the ordered list
    this.raceResults.unshift(this.timer.timeString);

    const record = document.createElement('li');
    record.textContent = this.timer.timeString;
    this.olRaceResults.prepend(record);
  }

  async submitTimeButton() {
    const confirm = await customAlert(
      'Are you sure you want to submit your results?',
    );

    if (confirm) {
      this.submitTime();
      this.clearRaceResults();
    }
  }

  clearRaceResults() {
    this.raceResults = [];
    this.olRaceResults.replaceChildren();
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
      this.paragraphFeedback.textContent = 'Failed to send message!';
      console.log('Failed to send message', response);
    }
  }
}

customElements.define('race-record', RaceRecord);
