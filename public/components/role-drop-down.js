import { refreshNav, refreshCurrentScreen } from '../index.js';

import {
  ROLES,
  USERS,
  loadStyleSheet,
  loadGlobalStyleSheet,
} from '../utils.js';

export class RoleDropDown extends HTMLElement {
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const globalSheet = await loadGlobalStyleSheet();
    const sheet = await loadStyleSheet(
      import.meta.resolve('./role-drop-down.css'),
    );
    this.shadow.adoptedStyleSheets = [globalSheet, sheet];

    this.section = document.createElement('section');

    this.select = document.createElement('select');
    this.select.addEventListener('change', this.setRole.bind(this));
    this.select.addEventListener('change', refreshNav);
    this.select.addEventListener('change', refreshCurrentScreen);

    this.optionOne = document.createElement('option');
    this.optionOne.value = ROLES.RUNNER;
    this.optionOne.textContent = 'Runner';

    this.optionTwo = document.createElement('option');
    this.optionTwo.value = ROLES.MARSHAL;
    this.optionTwo.textContent = 'Marshal';

    this.optionThree = document.createElement('option');
    this.optionThree.value = ROLES.ORGANISER;
    this.optionThree.textContent = 'Organiser';

    this.setSelected();

    this.select.append(this.optionOne, this.optionTwo, this.optionThree);
    this.section.append(this.select);

    this.shadow.append(this.select);
  }

  setSelected() {
    const role = localStorage.getItem('userRole');
    switch (role) {
      case ROLES.ORGANISER:
        this.optionThree.selected = true;
        break;
      case ROLES.MARSHAL:
        this.optionTwo.selected = true;
        break;
      case ROLES.RUNNER:
        this.optionOne.selected = true;
        break;
    }
  }

  setRole() {
    switch (this.select.value) {
      case ROLES.ORGANISER:
        localStorage.setItem('userId', USERS.ORGANISER);
        localStorage.setItem('userRole', ROLES.ORGANISER);
        break;
      case ROLES.MARSHAL:
        localStorage.setItem('userId', USERS.MARSHAL);
        localStorage.setItem('userRole', ROLES.MARSHAL);
        break;
      case ROLES.RUNNER:
        localStorage.setItem('userId', USERS.RUNNER);
        localStorage.setItem('userRole', ROLES.RUNNER);
        break;
    }
  }
}

customElements.define('role-drop-down', RoleDropDown);
