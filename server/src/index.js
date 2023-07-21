import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import apiRouter from '../routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

app.use('/api', apiRouter);

app.post('/api/hocuspocus', (req, res) => {
  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`Received ${event} event with payload:`, payload);

  res.status(200).send('OK');
});

if (process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Pennant Express cruising on port: ${PORT}`));
