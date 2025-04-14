export class RaceResults extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    this.olResults = document.createElement('ol');

    this.getAllRaceResults();

    this.intervalId = window.setInterval(this.update.bind(this), 1);

    shadow.append(this.olResults);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  update() {}

  async getAllRaceResults() {
    const response = await fetch('/api/v1/race-results');

    if (response.ok) {
      const allRaceResults = await response.json();
      console.log(allRaceResults);
    } else {
      console.log('failed to send message', response);
    }
  }
}

customElements.define('race-results', RaceResults);
