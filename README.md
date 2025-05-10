# Race Time - by up2207649

## Table of Contents

<!--toc:start-->

- [9.1 Key features](#91-key-features)
  - [Race Timer/Start and stop a race timer](#race-timerstart-and-stop-a-race-timer)
  - [Race Results/View all race results](#race-resultsview-all-race-results)
  - [Race Result/View a specific race result and edit the names](#race-resultview-a-specific-race-result-and-edit-the-names)
  - [Role Selection/Select a role in the drop-down for certain permissions](#role-selectionselect-a-role-in-the-drop-down-for-certain-permissions)
  - [No refresh](#no-refresh)
  - [Custom Alert Prompt](#custom-alert-prompt)
- [9.2 AI](#92-ai)
  - [Prompts to develop the `getAllRaceResults` function at `api/v1/race-results.js`](#prompts-to-develop-the-getallraceresults-function-at-apiv1race-resultsjs)
  - [Prompts to develop the `custom-alert` component at `public/components/custom-alert.js`](#prompts-to-develop-the-custom-alert-component-at-publiccomponentscustom-alertjs)
  - [Prompts to develop all components at `public/components`](#prompts-to-develop-all-components-at-publiccomponents)
  - [Prompts to develop the `checkRole` function at `app.js`](#prompts-to-develop-the-checkrole-function-at-appjs)
- [9.3 Discusses why and how you have improved your artefact since the prototype deadline](#93-discusses-why-and-how-you-have-improved-your-artefact-since-the-prototype-deadline)
- [9.4 Reflects on the development as a whole, including your use of AI.](#94-reflects-on-the-development-as-a-whole-including-your-use-of-ai)
<!--toc:end-->

## 9.1 Key features

Replace this text with an introduction to your key features.

1. The Organiser starts the timer.
2. Marshals stand at the finish line and record the racers as each runner passes the finish line.
3. The Runners queue up at the end of the race in-order so that a Marshal can assign their name to their time.
4. The Runners can then view their times in the app.

### Race Timer/Start and stop a race timer

In the bottom-left change your role to organiser, then click the "Timer" button in nav to open the race timer. To start the timer, click the start button. To stop the climber click the stop button, and then click 'Ok' on the prompt

Describe the thinking behind the design of this feature.

### Race Results/View all race results

### Race Result/View a specific race result and edit the names

### Role Selection/Select a role in the drop-down for certain permissions

In the bottom-left of the screen, the user can find the role drop down menu, clicking the menu will show three options; 'Runner', 'Marshal', and 'Organiser'.

This component uses `localStorage` to set the `userId` and `userRole`, which is subsequently used by the `setupNavButtons` function in `public/index.js` to dictate which nav buttons to show depending on the type of user that they are. Moreover, the userId is taken from the localStorage and added to the query when submitting results and when submitting result names, this is then checked with the IDS for users in the database to determine whether the user has the permission to access the API function.

### No refresh

### Custom Alert Prompt

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

## 9.4 Reflects on the development as a whole, including your use of AI.
