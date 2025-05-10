import { setSuccessColour, setErrorColour } from '../utils.js';

export class RaceResult extends HTMLElement {
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-result.css'));
    this.shadow.append(link);

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

    this.intervalId = window.setInterval(this.update.bind(this), 1);
  }

  async setRaceResult() {
    const urlParams = new URLSearchParams(window.location.search);
    this.raceResultId = urlParams.get('raceResultId');
    if (this.raceResultId) {
      this.raceResult = await this.getRaceResult();
      this.inputFirstName.value = this.raceResult.raceResultFirstName;
      this.inputLastName.value = this.raceResult.raceResultLastName;
    }
  }

  async getRaceResult() {
    const response = await fetch(
      `/api/v1/race-result?raceResultId=${this.raceResultId}`,
    );

    if (response.ok) {
      const raceResult = await response.json();
      return raceResult;
    } else {
      console.log('failed to send message', response);
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

    const payload = { raceResultId, raceResultFirstName, raceResultLastName };

    const response = await fetch('/api/v1/race-result', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setSuccessColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Successfully submitted!';
    } else {
      setErrorColour(this.paragraphFeedback);
      this.paragraphFeedback.textContent = 'Failed to send message!';
      console.log('failed to send message', response);
    }
  }
}

customElements.define('race-result', RaceResult);
