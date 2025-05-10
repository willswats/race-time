import { addEventListenersChangeContentRefresh } from '../index.js';

import { loadStyleSheet, loadGlobalStyleSheet } from '../utils.js';

export class RaceResults extends HTMLElement {
  constructor() {
    super();
    this.raceSections = [];
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const globalSheet = await loadGlobalStyleSheet();
    const sheet = await loadStyleSheet(
      import.meta.resolve('./race-results.css'),
    );
    this.shadow.adoptedStyleSheets = [globalSheet, sheet];

    this.placeHolderSection = document.createElement('section');
    this.placeHolderSection.hidden = true;

    this.placeHolderParagraph = document.createElement('p');
    this.placeHolderParagraph.textContent =
      'There are currently no race results';

    this.placeHolderSection.append(this.placeHolderParagraph);

    this.shadow.append(this.placeHolderSection);

    await this.addRaceSections();
  }

  async addRaceSections() {
    const allRaceResults = await this.getAllRaceResults();

    for (const race of allRaceResults) {
      const raceH1 = document.createElement('h1');
      raceH1.textContent = new Date(race.raceResultsTime).toLocaleDateString();

      const raceH2 = document.createElement('h2');
      raceH2.textContent = new Date(race.raceResultsTime).toLocaleTimeString();

      const raceOl = document.createElement('ol');

      const raceResults = JSON.parse(race.raceResults);
      for (const raceResult of raceResults) {
        const resultLi = document.createElement('li');

        const resultButton = document.createElement('button');
        resultButton.id = raceResult.raceResultId;
        resultButton.textContent = raceResult.raceResult;
        resultButton.dataset.screen = 'race-result';
        addEventListenersChangeContentRefresh(resultButton, 'click');
        resultButton.addEventListener('click', () => {
          this.appendParamToUrl(raceResult.raceResultId);
        });
        resultLi.append(resultButton);

        raceOl.appendChild(resultLi);
      }

      const raceSection = document.createElement('section');
      raceSection.append(raceH1, raceH2, raceOl);
      this.raceSections.push(raceSection);

      this.shadow.append(raceSection);
    }

    if (this.raceSections.length < 1) {
      this.placeHolderSection.hidden = false;
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
