export class RaceResults extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    const allRaceResults = await this.getAllRaceResults();

    for (const race of allRaceResults) {
      const raceH1 = document.createElement('h1');
      raceH1.textContent = race.id;

      const raceOl = document.createElement('ol');
      for (const result of race.results) {
        const resultLi = document.createElement('li');
        resultLi.textContent = result;
        raceOl.appendChild(resultLi);
      }

      shadow.append(raceH1, raceOl);
    }

    this.intervalId = window.setInterval(this.update.bind(this), 1);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  update() {}

  async getAllRaceResults() {
    const response = await fetch('/api/v1/race-results');

    if (response.ok) {
      const allRaceResults = await response.json();
      return allRaceResults;
    } else {
      console.log('failed to send message', response);
    }
  }
}

customElements.define('race-results', RaceResults);
