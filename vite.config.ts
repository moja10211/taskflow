import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { processAgentTaskWithGemini, parseCSV, analyzeDataset } from './src/server/agentLogic.ts';

function agentApiPlugin() {
  return {
    name: 'mojaflow-agent-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const parseBody = () => new Promise<any>((resolve) => {
          let data = '';
          req.on('data', (chunk: any) => { data += chunk; });
          req.on('end', () => {
            try {
              resolve(data ? JSON.parse(data) : {});
            } catch {
              resolve({});
            }
          });
        });

        if (req.url === '/api/agent/run' && req.method === 'POST') {
          try {
            const body = await parseBody();
            const result = await processAgentTaskWithGemini({
              prompt: body.prompt || '',
              attachedFile: body.attachedFile,
              enabledTools: body.enabledTools || ['file_reader', 'data_analyzer', 'web_researcher', 'action_dispatcher'],
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Execution error' }));
          }
          return;
        }

        if (req.url === '/api/tools/execute' && req.method === 'POST') {
          try {
            const body = await parseBody();
            const { tool, input } = body;
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

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(output));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', service: 'MojaFlow AI Server' }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), agentApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
