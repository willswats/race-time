import { changeContent } from '../index.js';

export class RaceResults extends HTMLElement {
  constructor() {
    super();
    this.raceSections = [];
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-results.css'));
    this.shadow.append(link);

    await this.addRaceSections();

    this.intervalId = window.setInterval(this.update.bind(this), 1);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  update() {}

  async addRaceSections() {
    const allRaceResults = await this.getAllRaceResults();

    for (const race of allRaceResults) {
      const raceH1 = document.createElement('h1');
      raceH1.textContent = race.raceResultsTime;
      const raceOl = document.createElement('ol');

      const raceResults = JSON.parse(race.raceResults);
      const raceResultsIds = JSON.parse(race.raceResultsId);
      for (let i = 0; i < raceResults.length; i++) {
        const raceResultsId = raceResultsIds[i];
        const raceResult = raceResults[i];

        const resultLi = document.createElement('li');

        const resultButton = document.createElement('button');
        resultButton.id = raceResultsId;
        resultButton.textContent = raceResult;
        resultButton.dataset.screen = 'race-result';
        resultButton.addEventListener('click', () => {
          changeContent('race-result');
          this.appendParamToUrl(raceResultsId);
        });
        resultLi.append(resultButton);

        raceOl.appendChild(resultLi);
      }

      const raceSection = document.createElement('section');
      raceSection.append(raceH1, raceOl);
      this.raceSections.push(raceSection);

      this.shadow.append(raceSection);
    }
  }

  appendParamToUrl(raceResultsId) {
    window.history.replaceState(null, null, `?raceResultId=${raceResultsId}`);
  }

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
