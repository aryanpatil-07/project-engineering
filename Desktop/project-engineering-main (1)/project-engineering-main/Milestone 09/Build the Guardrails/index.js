import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeController } from './src/controllers/analyzeController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/analyze', analyzeController);

app.listen(PORT, () => {
  console.log(`JobScan AI backend running on http://localhost:${PORT}`);
});
