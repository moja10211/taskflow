import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { processAgentTaskWithGemini, parseCSV, analyzeDataset } from './src/server/agentLogic.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

app.post('/api/agent/run', async (req, res) => {
  try {
    const { prompt, attachedFile, enabledTools } = req.body;
    const result = await processAgentTaskWithGemini({
      prompt: prompt || '',
      attachedFile,
      enabledTools: enabledTools || ['file_reader', 'data_analyzer', 'web_researcher', 'action_dispatcher'],
    });
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/agent/run:', err);
    res.status(500).json({ error: err.message || 'Execution error' });
  }
});

app.post('/api/tools/execute', async (req, res) => {
  try {
    const { tool, input } = req.body;
    let output: any = {};

    if (tool === 'file_reader') {
      const csvText = input.rawContent || '';
      const parsed = parseCSV(csvText);
      output = {
        status: 'SUCCESS',
        rowsParsed: parsed.rowCount,
        columns: parsed.columns,
        sample: parsed.rows.slice(0, 3),
      };
    } else if (tool === 'data_analyzer') {
      const { columns = [], rows = [] } = input;
      output = analyzeDataset(columns, rows);
    } else if (tool === 'web_researcher') {
      output = {
        status: 'COMPLETED',
        queriesExecuted: input.queries || [],
        citationsFound: 2,
      };
    } else if (tool === 'action_dispatcher') {
      output = {
        status: 'DISPATCHED_PREVIEW',
        target: input.target,
        action: input.actionType,
      };
    }

    res.json(output);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MojaFlow AI' });
});

// Serve static assets in production
const distDir = path.resolve(process.cwd(), 'dist');
app.use(express.static(distDir));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`MojaFlow AI server listening on port ${port}`);
});
