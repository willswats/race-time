import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import { getAllRaceResults, addRaceResults } from './api/v1/race-results.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use('/', express.static(join(__dirname, 'public')));

app.get('/api/v1/race-results', (_, res) => {
  const allRaceResults = getAllRaceResults();
  res.json(allRaceResults);
});

app.post('/api/v1/race-results', express.json(), (req, res) => {
  const newRaceResults = addRaceResults(req.body.raceResults);
  res.json(newRaceResults);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
