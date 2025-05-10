import { ROLES, USERS } from '../utils.js';

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
    this.select.addEventListener('change', this.changeUI.bind(this));

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

  async changeUI() {
    console.log(this.select.value);
    const user = await this.getUser(USERS.ORGANISER);
    console.log(user);
  }

  async getUser(userId) {
    const response = await fetch(`/api/v1/user?userId=${userId}`);

    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      console.log('failed to send message', response);
    }
  }
}

customElements.define('role-drop-down', RoleDropDown);
