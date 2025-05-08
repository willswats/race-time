import { ROLES } from '../utils.js';

export class RoleDropDown extends HTMLElement {
  constructor() {
    super();
    this.roles = [];
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./role-drop-down.css'));

    this.select = document.createElement('select');
    this.select.addEventListener('change', this.changeUI);

    this.optionOne = document.createElement('option');
    this.optionOne.value = ROLES.RUNNER;
    this.optionOne.textContent = 'Runner';

    this.optionTwo = document.createElement('option');
    this.optionTwo.value = ROLES.MARSHAL;
    this.optionTwo.textContent = 'Marshal';

    this.optionThree = document.createElement('option');
    this.optionThree.value = ROLES.ORGANISER;
    this.optionThree.textContent = 'Organiser';

    this.select.append(this.optionOne, this.optionTwo, this.optionThree);

    shadow.append(link, this.select);
  }

  getCurrentValue() {
    return this.select.value;
  }

  changeUI() {
    console.log('change');
  }
}

customElements.define('role-drop-down', RoleDropDown);
