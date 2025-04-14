export class ListResults extends HTMLElement {
  constructor() {
    super();

    this.results = [];
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    this.olResults = document.createElement('ol');

    this.intervalId = window.setInterval(this.update.bind(this), 1);

    this.getAllRaceResults();

    shadow.append(this.olResults);
  }

  disconnectedCallback() {
    this.intervalId = window.clearInterval(this.intervalId);
  }

  update() {}

  async getAllRaceResults() {
    const response = await fetch('/results');

    if (response.ok) {
      const results = await response.json();
      console.log(results);
    } else {
      console.log('failed to send message', response);
    }
  }
}

customElements.define('list-results', ListResults);
