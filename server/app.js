import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import notebooksRouter from './routes/notebooks.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', notebooksRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Pennant Express cruising on port: ${PORT}`));
