export class RaceResults extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-results.css'));

    const allRaceResults = await this.getAllRaceResults();

    for (const race of allRaceResults) {
      const raceH1 = document.createElement('h1');
      raceH1.textContent = race.raceResultsTime;
      const raceOl = document.createElement('ol');

      const raceResults = JSON.parse(race.raceResults);
      for (const raceResult of raceResults) {
        const resultLi = document.createElement('li');
        resultLi.textContent = raceResult;
        raceOl.appendChild(resultLi);
      }

      const raceSection = document.createElement('section');
      raceSection.append(raceH1, raceOl);

      shadow.append(link, raceSection);
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
