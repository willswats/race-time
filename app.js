import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import { getAllRaceResults, addRaceResults } from './api/v1/race-results.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use('/', express.static(join(__dirname, 'public')));

app.use('/app/*', express.static(join(__dirname, 'public/index.html')));

app.get('/api/v1/race-results', async (_, res) => {
  const allRaceResults = await getAllRaceResults();
  res.json(allRaceResults);
});

app.post('/api/v1/race-results', express.json(), async (req, res) => {
  const newRaceResults = await addRaceResults(req.body.raceResults);
  res.json(newRaceResults);
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
