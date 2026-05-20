import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { summarizeNotes } from './services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend from Vite's build folder
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/summarize', async (req, res) => {
  try {
    const notes = req.body?.notes;

    if (!notes || typeof notes !== 'string' || !notes.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Notes are required',
      });
    }

    const summary = await summarizeNotes(notes);

    return res.json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to summarize notes',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
