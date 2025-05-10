export const ROLES = {
  ORGANISER: 'organiser',
  MARSHAL: 'marshal',
  RUNNER: 'runner',
};

export const USERS = {
  ORGANISER: 'c9a2afcc-598a-49f8-a2cd-63ab27ab7a07',
  MARSHAL: '690000bf-ba18-4919-9312-0182a9b0e153',
  RUNNER: '5c18d76d-693a-4d9f-8157-d927dfa5600e',
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
  try {
    const customAlert = document.querySelector('custom-alert');
    const alertResult = await customAlert.showAlert(text);
    return alertResult;
  } catch (e) {
    return false;
  }
}

export function getRoleDropDownValue() {
  const roleDropDown = document.querySelector('role-drop-down');
  const value = roleDropDown.getCurrentValue();
  return value;
}
