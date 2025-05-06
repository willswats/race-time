export class RaceResult extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-result.css'));
    this.shadow.append(link);

    this.form = document.createElement('form');

    this.labelFirstName = document.createElement('label');
    this.labelFirstName.textContent = 'First Name';
    this.inputFirstName = document.createElement('input');

    this.labelLastName = document.createElement('label');
    this.labelLastName.textContent = 'Last Name';
    this.inputLastName = document.createElement('input');

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
}

customElements.define('race-result', RaceResult);
