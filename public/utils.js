export function setSuccessColour(e) {
  e.classList.remove('error');
  e.classList.add('success');
}

export function setErrorColour(e) {
  e.classList.remove('success');
  e.classList.add('error');
}
