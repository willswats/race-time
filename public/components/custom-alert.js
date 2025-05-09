export class CustomAlert extends HTMLElement {
  constructor() {
    super();
    this._resolvePromise = null;
    this._rejectPromise = null;
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
    this.alertSectionOverlay.addEventListener('click', () =>
      this.hideAlert(false),
    );

    this.alertSection = document.createElement('section');
    this.alertSection.id = 'alert';
    this.alertSection.hidden = true;

    this.alertSectionContent = document.createElement('section');
    this.alertSectionContent.id = 'alert-content';

    this.alertParagraph = document.createElement('p');

    this.alertButtonOk = document.createElement('button');
    this.alertButtonOk.textContent = 'Ok';
    this.alertButtonOk.addEventListener('click', () => this.confirmAlert(true));

    this.alertButtonCancel = document.createElement('button');
    this.alertButtonCancel.textContent = 'Cancel';
    this.alertButtonCancel.addEventListener('click', () =>
      this.hideAlert(false),
    );

    this.alertSectionContentButtons = document.createElement('section');
    this.alertSectionContentButtons.id = 'alert-content-buttons';
    this.alertSectionContentButtons.append(
      this.alertButtonCancel,
      this.alertButtonOk,
    );

    this.alertSectionContent.append(
      this.alertParagraph,
      this.alertSectionContentButtons,
    );
    this.alertSection.append(this.alertSectionContent);

    this.shadow.append(this.alertSectionOverlay, this.alertSection);
  }

  confirmAlert(confirmed) {
    if (this._resolvePromise) {
      this._resolvePromise(confirmed);
      this._resolvePromise = null;
      this._rejectPromise = null;
    }
    this.hideAlert();
  }

  hideAlert(confirmed = false) {
    if (!confirmed && this._rejectPromise) {
      this._rejectPromise(new Error('Alert dismissed'));
      this._resolvePromise = null;
      this._rejectPromise = null;
    }
    this.alertSection.hidden = true;
    this.alertSectionOverlay.hidden = true;
  }

  showAlert(text) {
    this.alertSection.hidden = false;
    this.alertSectionOverlay.hidden = false;
    this.alertParagraph.textContent = text;

    return new Promise((resolve, reject) => {
      this._resolvePromise = resolve;
      this._rejectPromise = reject;
    });
  }
}

customElements.define('custom-alert', CustomAlert);
