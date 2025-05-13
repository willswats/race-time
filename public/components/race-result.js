import {
  setSuccessColour,
  setErrorColour,
  getUserRole,
  getRaceResult,
  loadStyleSheet,
  loadGlobalStyleSheet,
  ROLES,
  addRaceResultNames,
} from '../utils.js';

export class RaceResult extends HTMLElement {
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const globalSheet = await loadGlobalStyleSheet();
    const sheet = await loadStyleSheet(
      import.meta.resolve('./race-result.css'),
    );
    this.shadow.adoptedStyleSheets = [globalSheet, sheet];

    this.form = document.createElement('form');

    this.labelFirstName = document.createElement('label');
    this.labelFirstName.textContent = 'First name';
    this.labelFirstName.htmlFor = 'input-first-name';

    this.inputFirstName = document.createElement('input');
    this.inputFirstName.id = 'input-first-name';

    this.labelLastName = document.createElement('label');
    this.labelLastName.textContent = 'Last name';
    this.labelLastName.htmlFor = 'input-last-name';

    this.inputLastName = document.createElement('input');
    this.inputLastName.id = 'input-last-name';

    this.paragraphFeedback = document.createElement('p');

    this.buttonSubmit = document.createElement('button');
    this.buttonSubmit.textContent = 'Submit';
    this.form.addEventListener('submit', (event) =>
      this.submitRaceResultNames(event),
    );

    if (getUserRole() === ROLES.RUNNER) {
      this.buttonSubmit.hidden = true;
      this.inputFirstName.disabled = true;
      this.inputLastName.disabled = true;
    }

    this.form.append(
      this.labelFirstName,
      this.inputFirstName,
      this.labelLastName,
      this.inputLastName,
      this.paragraphFeedback,
      this.buttonSubmit,
    );

    this.shadow.append(this.form);

    await this.setRaceResult();
  }

  async setRaceResult() {
    const urlParams = new URLSearchParams(window.location.search);
    this.raceResultId = urlParams.get('raceResultId');
    if (this.raceResultId) {
      const response = await getRaceResult(this.raceResultId);
      if (response.ok) {
        this.raceResult = await response.json();
        this.inputFirstName.value = this.raceResult.raceResultFirstName;
        this.inputLastName.value = this.raceResult.raceResultLastName;
      }
    }
  }

  async submitRaceResultNames(event) {
    event.preventDefault();

    const raceResultId = this.raceResultId;
    const raceResultFirstName = this.inputFirstName.value;
    const raceResultLastName = this.inputLastName.value;

    if (raceResultId === null) {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Invalid race result id!';
      return;
    }

    const response = await addRaceResultNames(
      raceResultId,
      raceResultFirstName,
      raceResultLastName,
    );

    if (response.ok) {
      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully submitted!';
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
}

customElements.define('race-result', RaceResult);
