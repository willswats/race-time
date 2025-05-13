import { addEventListenersChangeContentRefresh } from '../index.js';

import {
  loadStyleSheet,
  loadGlobalStyleSheet,
  getAllRaceResults,
} from '../utils.js';

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
    this.placeHolderParagraph.textContent = 'No race results found!';

    this.placeHolderSection.append(this.placeHolderParagraph);

    this.shadow.append(this.placeHolderSection);

    await this.addRaceSections();
  }

  showPlaceHolder(text) {
    if (this.raceSections.length < 1) {
      this.placeHolderSection.hidden = false;
      this.placeHolderParagraph.textContent = text;
    }
  }

  async addRaceSections() {
    const response = await getAllRaceResults();
    if (response.ok) {
      const allRaceResults = await response.json();

      for (const race of allRaceResults) {
        const raceH1 = document.createElement('h1');
        raceH1.textContent = new Date(
          race.raceResultsTimerStartDate,
        ).toLocaleDateString();

        const raceH2 = document.createElement('h2');
        raceH2.textContent = new Date(
          race.raceResultsTimerStartDate,
        ).toLocaleTimeString();

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

      this.showPlaceHolder('No race results found!');
    } else if (response.type === 'error') {
      this.showPlaceHolder('Failed to fetch!');
    }
  }

  appendParamToUrl(raceResultsId) {
    window.history.replaceState(null, null, `?raceResultId=${raceResultsId}`);
  }
}

customElements.define('race-results', RaceResults);
