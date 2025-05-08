import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import {
  getRaceResult,
  getAllRaceResults,
  addRaceResults,
  updateRaceResultNames,
} from './api/v1/race-results.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

async function apiGetRaceResult(req, res) {
  const raceResult = await getRaceResult(req.query.raceResultId);
  res.json(raceResult);
}

async function apiUpdateRaceResultNames(req, res) {
  const updatedRaceResult = await updateRaceResultNames(
    req.body.raceResultId,
    req.body.raceResultFirstName,
    req.body.raceResultLastName,
  );
  res.json(updatedRaceResult);
}

async function apiGetAllRaceResults(_, res) {
  const allRaceResults = await getAllRaceResults();
  res.json(allRaceResults);
}

async function apiAddRaceResults(req, res) {
  const newRaceResults = await addRaceResults(req.body.raceResults);
  res.json(newRaceResults);
}

function notFound(req, res) {
  res.status(404).sendFile(`${__dirname}/server-error-pages/404.html`);
}

app.use('/', express.static(join(__dirname, 'public')));
app.use('/app/*', express.static(join(__dirname, 'public/index.html')));

app.get('/api/v1/race-result', apiGetRaceResult);
app.patch('/api/v1/race-result', express.json(), apiUpdateRaceResultNames);
app.get('/api/v1/race-results', apiGetAllRaceResults);
app.post('/api/v1/race-results', express.json(), apiAddRaceResults);
app.all('*', notFound);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
