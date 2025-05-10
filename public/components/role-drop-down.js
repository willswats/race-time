import { refreshNav } from '../index.js';

import { ROLES, USERS } from '../utils.js';

export class RoleDropDown extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./role-drop-down.css'));

    this.select = document.createElement('select');
    this.select.addEventListener('change', this.setUser.bind(this));
    this.select.addEventListener('change', refreshNav);

    this.optionOne = document.createElement('option');
    this.optionOne.value = ROLES.RUNNER;
    this.optionOne.textContent = 'Runner';

    this.optionTwo = document.createElement('option');
    this.optionTwo.value = ROLES.MARSHAL;
    this.optionTwo.textContent = 'Marshal';

    this.optionThree = document.createElement('option');
    this.optionThree.value = ROLES.ORGANISER;
    this.optionThree.textContent = 'Organiser';

    this.user = USERS.RUNNER;

    this.select.append(this.optionOne, this.optionTwo, this.optionThree);

    shadow.append(link, this.select);
  }

  getRole() {
    return this.select.value;
  }

  getUser() {
    return this.user;
  }

  setUser() {
    switch (this.select.value) {
      case ROLES.ORGANISER:
        this.user = USERS.ORGANISER;
        break;
      case ROLES.MARSHAL:
        this.user = USERS.MARSHAL;
        break;
      case ROLES.RUNNER:
        this.user = USERS.RUNNER;
        break;
    }
  }
}

customElements.define('role-drop-down', RoleDropDown);
