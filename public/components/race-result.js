export class RaceResult extends HTMLElement {
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-result.css'));
    this.shadow.append(link);

    const urlParams = new URLSearchParams(window.location.search);
    this.raceResultId = urlParams.get('raceResultId');
    this.raceResult = await this.getRaceResult();

    this.form = document.createElement('form');

    this.labelFirstName = document.createElement('label');
    this.labelFirstName.textContent = 'First Name';
    this.inputFirstName = document.createElement('input');
    this.inputFirstName.value = this.raceResult.raceResultFirstName;

    this.labelLastName = document.createElement('label');
    this.labelLastName.textContent = 'Last Name';
    this.inputLastName = document.createElement('input');
    this.inputFirstName.value = this.raceResult.raceResultLastName;

    this.buttonSubmit = document.createElement('button');
    this.buttonSubmit.textContent = 'Submit';

    this.form.append(
      this.labelFirstName,
      this.inputFirstName,
      this.labelLastName,
      this.inputLastName,
      this.buttonSubmit,
    );

    this.shadow.append(this.form);

    this.intervalId = window.setInterval(this.update.bind(this), 1);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  update() {}

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

  async submitRaceResultNames() {
    const raceResultId = this.raceResultId;
    const raceResultFirstName = this.inputFirstName.value;
    const raceResultLastName = this.inputLastName.value;

    if (
      raceResultId === '' ||
      (raceResultFirstName === '' && raceResultLastName === '')
    )
      return;

    const payload = { raceResultId, raceResultFirstName, raceResultLastName };

    const response = await fetch('/api/v1/race-result', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedRaceResult = await response.json();
      console.log(updatedRaceResult);
    } else {
      console.log('failed to send message', response);
    }
  }
}

customElements.define('race-result', RaceResult);
