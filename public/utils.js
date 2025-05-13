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

export async function loadStyleSheet(stylesheet) {
  try {
    const response = await fetch(stylesheet);
    const cssText = await response.text();

    const sheet = new CSSStyleSheet();
    await sheet.replace(cssText);

    return sheet;
  } catch (error) {
    console.error('Failed to load stylesheet:', error);
    return new CSSStyleSheet();
  }
}

export async function loadGlobalStyleSheet() {
  const globalCss = import.meta.resolve('./globals.css');
  const sheet = await loadStyleSheet(globalCss);
  return sheet;
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

export function getUserId() {
  let userId = localStorage.getItem('userId');
  if (userId === null) {
    localStorage.setItem('userId', USERS.RUNNER);
    userId = USERS.RUNNER;
  }
  return userId;
}

export function getUserRole() {
  let userRole = localStorage.getItem('userRole');
  if (userRole === null) {
    localStorage.setItem('userRole', ROLES.RUNNER);
    userRole = ROLES.RUNNER;
  }
  return userRole;
}

export function createTimeString(startDate) {
  function padToDigits(digit, num) {
    return num.toString().padStart(digit, '0');
  }

  const timePassed = Date.now() - startDate;
  let seconds = Math.floor(timePassed / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  const timeString = `${padToDigits(2, hours)}:${padToDigits(2, minutes)}:${padToDigits(2, seconds)}`;
  return timeString;
}

export async function getAllRaceResults() {
  try {
    const response = await fetch('/api/v1/race-results');
    return response;
  } catch (error) {
    return Response.error();
  }
}

export async function getRaceResult(raceResultId) {
  try {
    const response = await fetch(
      `/api/v1/race-result?raceResultId=${raceResultId}`,
    );
    return response;
  } catch (error) {
    return Response.error();
  }
}

export async function addRaceResults(raceResults, raceResultsTimerStartDate) {
  const payload = {
    raceResults,
    raceResultsTimerStartDate,
  };

  const userId = getUserId();

  try {
    const response = await fetch(`/api/v1/race-results?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    return Response.error();
  }
}

export async function addRaceResultNames(
  raceResultId,
  raceResultFirstName,
  raceResultLastName,
) {
  const payload = { raceResultId, raceResultFirstName, raceResultLastName };
  const userId = getUserId();

  try {
    const response = await fetch(`/api/v1/race-result?userId=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    return Response.error();
  }
}

export async function getTimer() {
  try {
    const response = await fetch(`/api/v1/timer`);
    return response;
  } catch (error) {
    return Response.error();
  }
}

export async function setTimerStartDate(startDate) {
  const payload = { startDate };
  const userId = getUserId();

  try {
    const response = await fetch(`/api/v1/timer?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    return Response.error();
  }
}
