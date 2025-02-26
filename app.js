import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use('/', express.static(join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
