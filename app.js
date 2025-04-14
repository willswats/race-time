import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import { getAllResults, addResults } from './results.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8081;

app.use('/', express.static(join(__dirname, 'public')));

app.get('/api/v1/results', (_, res) => {
  const results = getAllResults();
  res.json(results);
});

app.post('/api/v1/results', express.json(), (req, res) => {
  const results = addResults(req.body.results);
  res.json(results);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
