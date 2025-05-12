import {
  setSuccessColour,
  setErrorColour,
  customAlert,
  getUserId,
  loadStyleSheet,
  loadGlobalStyleSheet,
} from '../utils.js';

export class RaceRecord extends HTMLElement {
  constructor() {
    super();
    this.raceResults = [];
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const globalSheet = await loadGlobalStyleSheet();
    const sheet = await loadStyleSheet(
      import.meta.resolve('./race-record.css'),
    );
    this.shadow.adoptedStyleSheets = [globalSheet, sheet];

    this.buttonClearRaceResults = document.createElement('button');
    this.buttonClearRaceResults.textContent = 'Clear';
    this.buttonClearRaceResults.hidden = true;

    this.buttonSubmitResults = document.createElement('button');
    this.buttonSubmitResults.textContent = 'Submit';
    this.buttonSubmitResults.hidden = true;

    this.buttonRecordTime = document.createElement('button');
    this.buttonRecordTime.textContent = 'Record';

    this.buttonClearRaceResults.addEventListener(
      'click',
      this.clearRaceResultsButton.bind(this),
    );
    this.buttonRecordTime.addEventListener(
      'click',
      this.recordTimerButton.bind(this),
    );
    this.buttonSubmitResults.addEventListener(
      'click',
      this.submitTimeButton.bind(this),
    );

    this.olRaceResults = document.createElement('ol');
    this.olRaceResults.reversed = true;

    this.sectionRaceResultsButtons = document.createElement('section');
    this.sectionRaceResultsButtons.id = 'timer-results-buttons';
    this.sectionRaceResultsButtons.append(
      this.buttonSubmitResults,
      this.buttonClearRaceResults,
    );

    this.paragraphFeedback = document.createElement('p');

    this.sectionRaceResults = document.createElement('section');
    this.sectionRaceResults.id = 'timer-results';
    this.sectionRaceResults.append(
      this.sectionRaceResultsButtons,
      this.paragraphFeedback,
      this.olRaceResults,
      this.buttonRecordTime,
    );

    this.timer = document.querySelector('race-timer');

    this.shadow.append(this.sectionRaceResults);
  }

  recordTimerButton() {
    if (this.timer.startDate !== null) {
      this.buttonClearRaceResults.hidden = false;
      this.buttonSubmitResults.hidden = false;
      this.paragraphFeedback.textContent = '';

      this.raceResults.push(this.timer.timeString);

      const record = document.createElement('li');
      record.textContent = this.timer.timeString;
      this.olRaceResults.prepend(record);
    } else {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent =
        'The timer must be started in order to record times!';
    }
  }

  clearRaceResults() {
    this.buttonClearRaceResults.hidden = true;
    this.buttonSubmitResults.hidden = true;

    this.raceResults = [];
    this.olRaceResults.replaceChildren();
  }

  async clearRaceResultsButton() {
    const confirm = await customAlert(
      'Are you sure you want to clear your results?',
    );

    if (confirm) {
      this.clearRaceResults();
    }
  }

  async submitTime() {
    const payload = {
      raceResults: this.raceResults,
      raceResultsTimerStartDate: this.timer.startDate,
    };
    const userId = getUserId();

    const response = await fetch(`/api/v1/race-results?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      this.clearRaceResults();

      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully submitted!';
    } else if (response.status === 403) {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent =
        "You role doesn't have permission to perform this action!";
    } else {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Failed to send message!';
    }
  }

  async submitTimeButton() {
    const confirm = await customAlert(
      'Are you sure you want to submit your results?',
    );

    if (confirm) {
      this.submitTime();
    }
  }
}

customElements.define('race-record', RaceRecord);
