# Race Time - by up2207649

## Table of Contents

<!--toc:start-->

- [9.1 Key features](#91-key-features)
  - [Role Drop Down/Select a role in the drop-down for certain permissions](#role-drop-downselect-a-role-in-the-drop-down-for-certain-permissions)
  - [Timer/Start and stop a race timer](#timerstart-and-stop-a-race-timer)
  - [Record Screen/Record runners who cross the finish line](#record-screenrecord-runners-who-cross-the-finish-line)
  - [Results/View all race results](#resultsview-all-race-results)
  - [Result/View a specific race result and edit the names](#resultview-a-specific-race-result-and-edit-the-names)
  - [Client-side Routing/No browser refreshing when navigating through pages](#client-side-routingno-browser-refreshing-when-navigating-through-pages)
  - [Custom Alert Prompt/Replaces the default JavaScript alert](#custom-alert-promptreplaces-the-default-javascript-alert)
  - [Progressive Web App/Install the application on your device](#progressive-web-appinstall-the-application-on-your-device)
- [9.2 AI](#92-ai)
  - [Prompts to develop the `getAllRaceResults` function at `api/v1/race-results.js`](#prompts-to-develop-the-getallraceresults-function-at-apiv1race-resultsjs)
  - [Prompts to develop the `custom-alert` component at `public/components/custom-alert.js`](#prompts-to-develop-the-custom-alert-component-at-publiccomponentscustom-alertjs)
  - [Prompts to develop all components at `public/components`](#prompts-to-develop-all-components-at-publiccomponents)
  - [Prompts to develop the `checkRole` function at `app.js`](#prompts-to-develop-the-checkrole-function-at-appjs)
- [9.3 Discusses why and how you have improved your artefact since the prototype deadline](#93-discusses-why-and-how-you-have-improved-your-artefact-since-the-prototype-deadline)
- [9.4 Reflects on the development as a whole, including your use of AI](#94-reflects-on-the-development-as-a-whole-including-your-use-of-ai)
<!--toc:end-->

## 9.1 Key features

Key features include:

- Role drop down selection with permissions, allowing users to choose between 'Runner', 'Marshal' and 'Organiser' - this selectively shows UI and prevents certain users from performing certain actions on the server.
- Timer for the organiser to start and stop the time for the race.
- Record screen for organisers and marshals to record runners who cross the finish line.
- Results screen so that users can view all of the race results.
- View an individual result by clicking on one of them on the results screen - this is used by marshals and organisers to add the runner's name to a result. Once the name is added, the runner can find it and view it there self, but can not edit it.
- Client-side routing, allowing for no browser refreshing - which also allows for the state to be saved when navigating between pages. Certain pages are designated to refresh the data from the server (results screen and view result screen), but this does not require any refreshing of the browser.
- A custom alert prompt is used in places where the user is performing an important action (stopping the timer and submitting race results), this allows for the alert to fit the style of the application more. Moreover, the default JavaScript alert causes the application to pause, which causes issues with the running timer.
- Service worker and manifest file for installing the application as a progressive web app.

### Role Drop Down/Select a role in the drop-down for certain permissions

In the bottom-left of the screen, the user can find the role drop down menu, clicking the menu will show three options; 'Runner', 'Marshal', and 'Organiser'. Selecting one of these options will assign the role to the user, this will rebuild the nav to show only the pages that the current role has access to, moreover, it will not allow certain roles to perform certain actions on the server. The runner role cannot submit times to the server, and they cannot edit a race result, whereas the marshal and organiser roles can, this is shown in the UI of the application with error messages (after the server responds with 403 - forbidden).

The `role-drop-down` component uses `localStorage` to set the `userId` and `userRole`. The `userId` and `userRole` are taken from `public/utils.js` through the constants `ROLES` and `USERS`. The `ROLES` object contains strings assigned to each role, this prevents the developer from using the wrong string for a role. The `USERS` object contains keys set to the role, and user ids as the value, where the user ids correspond to users in the database with that role (as seen in `/migrations-sqlite/001-initial.sql`), this is used for authentication.

On the client, when submitting race results and when editing a race result, the user id is sent to the server as a query parameter (the user id is taken from `localStorage` through the utility function `getUserId()` at `public/utils.js`). On the server the user id sent as a query parameter is checked to see if the user id exists in the database and if the user id corresponds with the correct role to perform that action (as seen with the `checkRole()` function in `app.js`). This method of authentication is not secure, however, I am assuming that the authentication would be refactored so that it is handled by a third-party if this were to ever be used.

To selectively show parts of the UI, the `setupNavButtons()` function in `public/index.js` uses the `getUserRole()` function in `public/utils.js` to dictate which nav buttons to show depending on the type of user that they are. The `role-drop-down` component uses the `refreshNav()` and `refreshCurrentScreen()` functions from `public/index.js` whenever the `<select>` (`role-drop-down` is a `<select>` component) changes so that the UI is updated to correspond to the current role - this can be seen with the race result page, where the inputs become unable to edit and the submit button is hidden as the runner role.

### Timer/Start and stop a race timer

In the bottom-left of the screen, change your role to organiser, then click the "Timer" button in nav to open the race timer. To start the timer, click the start button. To stop the timer click the stop button, and then click 'Ok' on the prompt.

The `race-timer` component calls `getTimer()` when it is added to the document, this performs a `GET` request for the timer in the database, and sets the start date to the start date stored in the database. The timer table in the database is one row `timerStartDate`, which is `null` by default. The `startTimer()` method is called when the user clicks start, this sets the `timerStartDate` in the database to `Date.now()`, `stopTimer()` does the same but sets it to `null`. The `timeString` used in the UI is created through the use of the `timerStartDate`.

### Record Screen/Record runners who cross the finish line

In the bottom-left of the screen, change your role to organiser, click on the timer button in the nav, click start on the timer, then navigate to the record page, you can now record times by clicking record. You can submit your times to the database by clicking "Submit" and you can clear the local results by clicking "Clear". If you do not start the timer before clicking record, an error message will appear on the UI and you will not be able to record any times. After clicking start on the timer, you can freely change your role to marshal if needed as well.

The record button uses a reference to the timer with the use of `document.querySelector` to get the `timeString` from the `race-timer` component, which it then adds to a `raceResults` array with `push`. It then creates an `<li>` element with the `textContent` set to the timer's `timeString`, which it `prepend`'s to the `<ol>` element.I am using `prepend` instead of `append` so that the element appears at the top of the ordered list, this ensures that the user will always receive visual feedback upon clicking the record button.

The submit button calls `submitTime()` which sends a `POST` request to the server with the `userId` attached as a query parameter as this action can only be performed by users who are organisers or marshals. The payload contains the `raceResults` and the `raceResultsTimerStartDate`. The `raceResultsTimerStartDate` is set to the timer's `startDate` so that it can be used in the `GROUP BY` when getting all the race results from the database (in the API at `/api/v1/race-results` with the `getAllRaceResults()` function), this allows for multiple marshals to record and submit race results, as they can be merged into based upon the `raceResultsTimerStartDate`.

### Results/View all race results

Click the "Results" button in the nav to open the race results screen. This screen shows all the results that have been recorded and submitted my marshals or organisers on the "Record" screen. Click on an individual race result to view the first name and last name of the race result (if they have been set by a marshal or organiser, otherwise it will be empty).

The race results screen gets all the race results from the database through a fetch request to the server. The server responds with all the race results, grouped by the `race_results_timer_start_date`, this allows for marshals to submit results separately and have them merged into one. It then constructs the race `<section>` elements for each race, as well as a `<li>` and `<button>` for each race result. If there are no race results, then the place holder element is shown, which states that there are no race results. All of the buttons have an event listener for appending the `?raceResultId` parameter to the URL along with the race id.

### Result/View a specific race result and edit the names

After recording and submitting results on the record screen, click the "Results" button in the nav to open the race results screen, then click on a specific race result. To edit the first name and last name of a race result, ensure that your role is set to marshal or organiser, then change the first name, last name and click submit.

The race result screen gets the `raceResultId` from the URL when it is added to the document, it then does a `GET` request for the specific race result with that id, which it then uses to populate the input fields with the first name and last name if they exist for that race result.

The `submitRaceResultNames()` method is used to update the first name and last name of the race result in the database. It sends the `raceResultId`, `raceResultFirstName` and `raceResultLastName` as the payload, as well as the `userId` in the parameter to verify that the user is either a marshal or organiser.

### Client-side Routing/No browser refreshing when navigating through pages

Click on any of the buttons in the nav and the pages will load without the browser refreshing.

This was accomplished in the `public/index.js` file, where the content is fetched from the `public/screens` directory and then added to the html with a class that hides the element. All of the buttons have a `dataset.screen` property which dictates the screen that it should show when clicked. The buttons have events added to them that use the `event.target.dataset.screen` to show that specific screen by hiding all other screens and then removing the class for that specific screen. Some of the buttons, such as the `Results` button in the nav have an extra event listener added to them, which refreshes the screen contents by removing that screen element and then rebuilding the content for it. Certain screens need to refresh, because the data can get updated while the user is using the application.

### Custom Alert Prompt/Replaces the default JavaScript alert

Change your role to organiser, click on the timer, click start and then click stop - this will show the custom-alert.

The `custom-alert` `showAlert()` returns a promise which is resolved if the user clicks "Ok" and rejected if the user clicks "Cancel". In `public/utils.js` the `customAlert()` function searches for the `custom-alert` component in the document, then calls the `showAlert()` method, this is wrapped in a `try catch` statement so that `false` can be returned if the user rejects the promise.

### Progressive Web App/Install the application on your device

You can install the web app on your device depending on the browser you are using in different ways, for Chrome see [here](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop).

Once the window loads the service worker is registered, this is done in `public/register-sw.js`. It registers the `public/sw.js` file, which adds all the `public` files to the cache.

## 9.2 AI

### Prompts to develop the `getAllRaceResults` function at `api/v1/race-results.js`

The following prompt helped me to develop this feature:

```text
I have the following sqlite database:

CREATE TABLE race_results (
    race_results_id CHAR(36) PRIMARY KEY,
    race_results_time DATETIME,
    race_result_id CHAR(36),
    FOREIGN KEY (race_result_id) REFERENCES race_result (race_result_id)
);

CREATE TABLE race_result (
    race_result_id CHAR(36),
    race_result TEXT NOT NULL
);

In my node js app I am using the following select statement to get entries from it:

    'SELECT * FROM race_results INNER JOIN race_result ON race_results.race_result_id = race_result.race_result_id',

It retrieves them like this:

{
race_results_id: "99b6a874-0605-4ef2-8380-878a3ecb82e3",
race_results_time: "2025-04-15T21:38:03.371Z",
race_result_id: "9a4a538c-c9d0-4eeb-a7f7-31f746b1efee",
race_results_time: "2025-04-15T21:38:03.371Z"
}

I would like to retrieve them in a different format like this:

{
race_results_id: "99b6a874-0605-4ef2-8380-878a3ecb82e3",
race_results_time: "2025-04-15T21:38:03.371Z",
race_results: [
{
race_result_id: "9a4a538c-c9d0-4eeb-a7f7-31f746b1efee",
race_results_time: "2025-04-15T21:38:03.371Z"
}
]
}

How can I achieve this?
```

The response gave me a few different ways to write the SQL query. I opted to use the JSON functions version as the other options were to process the results manually, or use two separate queries, which I think are both worse than using JSON functions as they seem the most simple.

### Prompts to develop the `custom-alert` component at `public/components/custom-alert.js`

The following prompt helped me to develop this feature:

```text
how can i make this web component return a promise from confirmAlert, depending on if the user clicks the ok button?

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
    this.alertSectionOverlay.addEventListener(
      'click',
      this.hideAlert.bind(this),
    );

    this.alertSection = document.createElement('section');
    this.alertSection.id = 'alert';
    this.alertSection.hidden = true;

    this.alertSectionContent = document.createElement('section');
    this.alertSectionContent.id = 'alert-content';

    this.alertParagraph = document.createElement('p');

    this.alertButtonOk = document.createElement('button');
    this.alertButtonOk.textContent = 'Ok';
    this.alertButtonOk.addEventListener('click', this.confirmAlert.bind(this));

    this.alertButtonCancel = document.createElement('button');
    this.alertButtonCancel.textContent = 'Cancel';
    this.alertButtonCancel.addEventListener('click', this.hideAlert.bind(this));

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
    this.hideAlert();
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
```

The chatbot updated my implementation with a promise based version which I decided to use, this can be seen in the final version.

### Prompts to develop all components at `public/components`

```text
how to prevent fouc in web components with the style added like this:

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'closed' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', import.meta.resolve('./race-results.css'));

    this.placeHolderSection = document.createElement('section');
    this.placeHolderParagraph = document.createElement('p');
    this.placeHolderParagraph.textContent =
      'There are currently no race results';
    this.placeHolderSection.append(this.placeHolderParagraph);

    this.shadow.append(link, this.placeHolderSection);

    await this.addRaceSections();
  }
```

The chatbot provided four options for preventing fouc (flash of unstyled component), I opted for the modern browser approach using constructable style sheets. I adapted the code and added it to `utils.js` (as seen with `loadStyleSheet` and `loadGlobalStyleSheet`) so that it could be used easily in all web components. The other options would be more difficult to develop with, for example, using inline styles would make the css formatter that I use not work.

### Prompts to develop the `checkRole` function at `app.js`

```text
why is req.user undefined in checkRole?

import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import { ROLES } from './public/utils.js';

import {
  getRaceResult,
  getAllRaceResults,
  addRaceResults,
  updateRaceResultNames,
} from './api/v1/race-results.js';

import { getUser } from './api/v1/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

// Middleware to check user role
function checkRole(role) {
  return (req, res, next) => {
    console.log(role);
    console.log(req.user);
    if (req.user.role !== role) {
      res.status(403).send('Access denied.');
      return;
    }
    // User has the required role, proceed to the next middleware or route handler
    next();
  };
}

async function apiGetRaceResult(req, res) {
  const raceResult = await getRaceResult(req.query.raceResultId);
  res.json(raceResult);
}

async function apiUpdateRaceResultNames(req, res, next) {
  try {
    const updatedRaceResult = await updateRaceResultNames(
      req.body.raceResultId,
      req.body.raceResultFirstName,
      req.body.raceResultLastName,
    );
    res.json(updatedRaceResult);
  } catch (error) {
    next(error);
  }
}

async function apiGetAllRaceResults(_, res) {
  const allRaceResults = await getAllRaceResults();
  res.json(allRaceResults);
}

async function apiAddRaceResults(req, res, next) {
  try {
    const newRaceResults = await addRaceResults(req.body.raceResults);
    res.json(newRaceResults);
  } catch (error) {
    next(error);
  }
}

async function apiLogin(req, res) {
  const user = await getUser(req.query.userId);

  if (!user) return res.status(401).send('Invalid credentials');

  const { userId, userRole } = user;

  req.user = {
    id: userId,
    role: userRole,
  };
  console.log(req.user);

  res.json(user);
}

function notFound(_, res) {
  res.status(404).sendFile(`${__dirname}/server-error-pages/404.html`);
}

app.use('/', express.static(join(__dirname, 'public')));
app.use('/app/*', express.static(join(__dirname, 'public/index.html')));

app.get('/api/v1/race-result', apiGetRaceResult);
app.patch(
  '/api/v1/race-result',
  checkRole(ROLES.MARSHAL),
  express.json(),
  apiUpdateRaceResultNames,
);

app.get('/api/v1/race-results', apiGetAllRaceResults);
app.post('/api/v1/race-results', express.json(), apiAddRaceResults);

app.get('/api/v1/user', apiLogin);

app.all('*', notFound);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
```

The chatbot told me that `req.user` is undefined, because HTTP is stateless so `req.user` won't carry over to the next request, it then provided several solutions, however, two of them were using external libraries that we are not allowed to use. I opted for the solution that it called a "Quick fix (just for testing)", because this application does not need proper authentication as it is assumed that it would be handled by a third party. This solution involved adding `getUser` to the `checkRole` function, therefore, it required me to add the `userId` to the URL in each fetch request on the client where the route is protected (as seen with the `submitTime` function at `public/components/race-record.js` and the `submitRaceResultNames` function at `public/components/race-result.js`)

## 9.3 Discusses why and how you have improved your artefact since the prototype deadline

While developing this application, it went through several iterations. After the Easter break, I had an app which had the `race-timer` and the `race-results` components on the same page, and then a separate page for the race results. After learning that the app requires roles, I re-structured it so that the `race-results` component is on a separate screen. Moreover, this allowed me to increase the size of certain elements, which is important because the app is expected to be used by older people out in cold weather.

## 9.4 Reflects on the development as a whole, including your use of AI

Using AI helped me to solve certain issues quicker, however, some times the code it provided was written poorly or did not work at all.
