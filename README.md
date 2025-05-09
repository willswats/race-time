# Race Time

## How this works

1. The race-starter starts the timer.
2. Marshals stand at the finish line and record the racers as each runner passes the finish line.
3. The runners queue up at the end of the race in-order so that a race marshal can assign their name to their time.

## Key features

Replace this text with an introduction to your key features.

### Race Timer/Start and stop a race timer

Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.

## AI

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
