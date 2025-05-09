export const ROLES = {
  RUNNER: 'runner',
  MARSHAL: 'marshal',
  ORGANISER: 'organiser',
};

export function showElement(e) {
  e.classList.remove('hidden');
}

export function hideElement(e) {
  e.classList.add('hidden');
}

export function setSuccessColour(e) {
  e.classList.remove('error');
  e.classList.add('success');
}

export function setErrorColour(e) {
  e.classList.remove('success');
  e.classList.add('error');
}

export async function customAlert(text) {
  const customAlert = document.querySelector('custom-alert');
  const alertResult = await customAlert.showAlert(text);
  return alertResult;
}

export function getRoleDropDownValue() {
  const roleDropDown = document.querySelector('role-drop-down');
  const value = roleDropDown.getCurrentValue();
  return value;
}
