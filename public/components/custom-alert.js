export class CustomAlert extends HTMLElement {
  constructor() {
    super();
    this.confirmed = false;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./custom-alert.css'));
    this.shadow.append(link);

    this.alertSectionOverlay = document.createElement('section');
    this.alertSectionOverlay.id = 'alert-overlay';
    this.alertSectionOverlay.hidden = true;
    this.alertSectionOverlay.addEventListener('click', this.hideAlert);

    this.alertSection = document.createElement('section');
    this.alertSection.id = 'alert';
    this.alertSection.hidden = true;

    this.alertSectionContent = document.createElement('section');
    this.alertSectionContent.id = 'alert-content';

    this.alertParagraph = document.createElement('p');

    this.alertButtonOk = document.createElement('button');
    this.alertButtonOk.textContent = 'Ok';
    this.alertButtonOk.addEventListener('click', this.confirmAlert);

    this.alertButtonCancel = document.createElement('button');
    this.alertButtonCancel.textContent = 'Cancel';
    this.alertButtonCancel.addEventListener('click', this.hideAlert);

    this.alertSectionContent.append(
      this.alertParagraph,
      this.alertButtonCancel,
      this.alertButtonOk,
    );
    this.alertSection.append(this.alertSectionContent);

    this.shadow.append(this.alertSectionOverlay, this.alertSection);
  }

  confirmAlert() {
    this.confirmed = true;
  }

  showAlert(text) {
    this.alertSection.hidden = false;
    this.alertSectionOverlay.hidden = false;
    this.alertParagraph.textContent = text;
  }

  hideAlert() {
    this.alertSection.hidden = true;
    this.alertSectionOverlay.hidden = true;
  }
}

customElements.define('custom-alert', CustomAlert);
