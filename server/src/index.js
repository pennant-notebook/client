import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import notebooksRouter from '../routes/notebooks.js';

const app = express();
app.use(cors());
app.use(express.json());

// Get the dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

app.use('/api', notebooksRouter);

if (process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Pennant Express cruising on port: ${PORT}`));
