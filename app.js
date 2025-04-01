import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import { getTimes, addTime } from './times.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use('/', express.static(join(__dirname, 'public')));

function getMessages(req, res) {
  res.json(getTimes());
}

function postMessage(req, res) {
  const times = addTime(req.body.time);
  res.json(times);
}

app.get('/times', getMessages);
app.post('/times', express.json(), postMessage);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
