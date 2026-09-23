import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { CommandInput } from './components/CommandInput.tsx';
import { ExecutionTimeline } from './components/ExecutionTimeline.tsx';
import { ApprovalCard } from './components/ApprovalCard.tsx';
import { ArtifactsView } from './components/ArtifactsView.tsx';
import { SampleDataModal } from './components/SampleDataModal.tsx';
import type { TaskSession, ToolDefinition, AttachedFile, AgentStep } from './types.ts';
import { executeAgentTask } from './services/agentEngine.ts';
import { SAMPLE_DATASETS } from './data/sampleDatasets.ts';
import { Activity, Layers, Sparkles } from 'lucide-react';

const INITIAL_TOOLS: ToolDefinition[] = [
  {
    id: 'file_reader',
    name: 'File Reader',
    category: 'Ingestion & Schema',
    description: 'Parse uploaded CSV, JSON, and structured text records with schema validation.',
    enabled: true,
    requiresSafetyGate: false,
    capabilities: ['CSV Parsing', 'JSON Hierarchy', 'Encoding Detection'],
  },
  {
    id: 'data_analyzer',
    name: 'Data Analyzer',
    category: 'Statistical Analytics',
    description: 'Calculate aggregates, period quotas, cohort variances, and flag statistical anomalies.',
    enabled: true,
    requiresSafetyGate: false,
    capabilities: ['Totals & Averages', 'Variance to Quota', 'Anomaly Clustering'],
  },
  {
    id: 'web_researcher',
    name: 'Web Researcher',
    category: 'Market Intelligence',
    description: 'Corroborate internal findings with external market trends, industry benchmarks, and citations.',
    enabled: true,
    requiresSafetyGate: false,
    capabilities: ['Industry Benchmark Lookup', 'Competitor Trend Analysis', 'Source Attribution'],
  },
  {
    id: 'action_dispatcher',
    name: 'Action Dispatcher',
    category: 'Execution & Dispatch',
    description: 'Draft executive alerts, dispatch email notifications, or export tasks to Kanban boards.',
    enabled: true,
    requiresSafetyGate: true,
    capabilities: ['Email Draft Formatting', 'Kanban Task Generation', 'SMTP Dispatch'],
  },
];

export default function App() {
  const [tools, setTools] = useState<ToolDefinition[]>(INITIAL_TOOLS);
  const [sessions, setSessions] = useState<TaskSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'timeline' | 'artifacts'>('split');

  // Load initial pre-seeded session so the user immediately experiences the dashboard
  useEffect(() => {
    const defaultSample = SAMPLE_DATASETS[0];
    const initialSessionId = 'session-q3-sales-analysis';

    const defaultSession: TaskSession = {
      id: initialSessionId,
      title: "Q3 Sales CSV Anomaly Audit & Email Draft",
      prompt: "Analyze last week's sales CSV, summarize negative trends, and prepare an email draft",
      status: 'waiting_approval',
      createdAt: '10:42 AM',
      durationMs: 3200,
      plan: [
        {
          id: 'p-1',
          stepNumber: 1,
          title: 'Ingest & Validate sales_q3_report.csv',
          description: 'Parse records, inspect headers and column types.',
          toolTarget: 'file_reader',
          status: 'completed',
        },
        {
          id: 'p-2',
          stepNumber: 2,
          title: 'Run Quantitative Anomaly Analysis',
          description: 'Calculate total revenue ($523K) vs target ($547K) and isolate shortfall regions.',
          toolTarget: 'data_analyzer',
          status: 'completed',
        },
        {
          id: 'p-3',
          stepNumber: 3,
          title: 'Corroborate with Market & Competitive Research',
          description: 'Query external benchmark feeds on Western European enterprise SaaS churn.',
          toolTarget: 'web_researcher',
          status: 'completed',
        },
        {
          id: 'p-4',
          stepNumber: 4,
          title: 'Synthesize Draft Email & Dispatch Tasks',
          description: 'Format executive alert to VP Sales and create Kanban remediation items.',
          toolTarget: 'action_dispatcher',
          status: 'in_progress',
        },
      ],
      steps: [
        {
          id: 's-1',
          phase: 'thought',
          title: 'Decomposing User Goal into ReAct Loop',
          content: 'User requested comprehensive analysis of Q3 sales data with executive email output. Initializing autonomous plan: parse file schema, run anomaly statistics, corroborate external context, and format deliverables with human-in-the-loop safety verification.',
          timestamp: '10:42:01',
          durationMs: 340,
        },
        {
          id: 's-2',
          phase: 'action',
          title: 'Invoking File Reader Tool',
          content: 'Reading 10 row records from sales_q3_report.csv across 8 column attributes.',
          tool: 'file_reader',
          toolInput: { filename: 'sales_q3_report.csv', rows: 10, encoding: 'UTF-8' },
          timestamp: '10:42:02',
          durationMs: 420,
        },
        {
          id: 's-3',
          phase: 'observation',
          title: 'Dataset Ingestion Validated',
          content: 'Successfully ingested 10 transactions. Headers detected: [Date, Region, Product, Units_Sold, Revenue, Target, Customer_Rating, Notes]. Zero corrupted entries.',
          tool: 'file_reader',
          toolOutput: { status: 'SUCCESS', rows: 10, columns: 8, memory: '4.8 KB' },
          timestamp: '10:42:03',
          durationMs: 210,
        },
        {
          id: 's-4',
          phase: 'thought',
          title: 'Identifying Negative Variances & Quota Deficits',
          content: 'Aggregating revenue by region and comparing against target quotas. EMEA Enterprise missed quota by -24.7% ($64K vs $85K) and LATAM missed by -50% ($15K vs $30K). Customer rating in EMEA dropped to 3.5/5.0 with notes indicating 2 accounts lost to competitor.',
          timestamp: '10:42:04',
          durationMs: 480,
        },
        {
          id: 's-5',
          phase: 'action',
          title: 'Invoking Data Analyzer Tool',
          content: 'Executing statistical variance calculations, outlier detection, and regional cohort breakdown.',
          tool: 'data_analyzer',
          toolInput: { metrics: ['Revenue', 'Target', 'Customer_Rating'], thresholdStdDev: 1.8 },
          timestamp: '10:42:05',
          durationMs: 590,
        },
        {
          id: 's-6',
          phase: 'observation',
          title: 'Statistical Shortfall Quantified',
          content: 'Total revenue recorded at $523,000 against a $547,000 target (-$24,000 net variance, -4.4%). Two severe negative clusters identified: 1) EMEA Enterprise churn; 2) LATAM budget freeze.',
          tool: 'data_analyzer',
          toolOutput: {
            aggregateRevenue: '$523,000',
            targetQuota: '$547,000',
            netVariance: '-$24,000 (-4.4%)',
            criticalAnomalies: 2,
          },
          timestamp: '10:42:06',
          durationMs: 290,
        },
        {
          id: 's-7',
          phase: 'thought',
          title: 'Gathering Market Context via Web Intelligence',
          content: 'Querying external industry benchmarks to determine whether European churn aligns with broader macro headwinds or specific localized issues.',
          timestamp: '10:42:07',
          durationMs: 380,
        },
        {
          id: 's-8',
          phase: 'action',
          title: 'Invoking Web Researcher Tool',
          content: 'Searching synthesized analyst reports for EMEA SaaS churn rate benchmarks and LATAM IT procurement delays.',
          tool: 'web_researcher',
          toolInput: { queries: ['EMEA enterprise SaaS retention trends Q3', 'LATAM IT procurement budget outlook 2026'] },
          timestamp: '10:42:08',
          durationMs: 620,
        },
        {
          id: 's-9',
          phase: 'observation',
          title: 'External Macro Evidence Corroborated',
          content: 'External reports confirm 14% elongated procurement cycles across DACH and aggressive competitor discounting in Frankfurt. Internal anomalies reflect macroeconomic headwinds.',
          tool: 'web_researcher',
          toolOutput: { confidence: 0.94, sourcesChecked: 2 },
          timestamp: '10:42:09',
          durationMs: 310,
        },
        {
          id: 's-10',
          phase: 'thought',
          title: 'Preparing Deliverables & Triggering Safety Gate',
          content: 'Synthesis complete. I have structured an executive email alert to the VP of Sales and exported 4 remediation tasks to a Kanban board. Since sending an external email involves an outbound transmission, I MUST pause execution for Human-in-the-Loop authorization.',
          timestamp: '10:42:10',
          durationMs: 410,
        },
        {
          id: 's-11',
          phase: 'action',
          title: 'Halting at Human-in-the-Loop Safety Gate',
          content: 'Pausing pipeline execution. Rendering interactive Approval Card for user confirmation before releasing email to executive distribution list.',
          tool: 'action_dispatcher',
          toolInput: {
            actionType: 'send_email',
            target: 'vp-sales@enterprise.corp',
            subject: '[ACTION REQUIRED] Q3 Revenue Variance Alert: EMEA Enterprise Churn & LATAM Shortfall',
          },
          isApprovalRequired: true,
          timestamp: '10:42:11',
          durationMs: 140,
        },
      ],
      currentStepIndex: 10,
      activeApproval: {
        id: 'appr-initial-01',
        actionType: 'send_email',
        title: 'Authorize Executive Alert Email Dispatch',
        description: 'The agent has drafted an executive alert containing sensitive Q3 revenue shortfall figures and competitor churn details. Confirm recipient and body before releasing to production mail server.',
        severity: 'high',
        target: 'vp-sales@enterprise.corp; cro@enterprise.corp',
        payload: {
          recipient: 'vp-sales@enterprise.corp, cro@enterprise.corp',
          subject: '[ACTION REQUIRED] Q3 Revenue Variance Alert: EMEA Enterprise Churn & LATAM Shortfall',
          body: `Executive Leadership Team,\n\nOur automated weekly anomaly audit of Q3 sales data revealed two significant negative variances requiring immediate operational response:\n\n1. Revenue Shortfall: Total quarterly revenue stands at $523,000 against our $547,000 target (-4.4% net deficit, -$24,000 gap).\n2. Critical EMEA Enterprise Churn: EMEA Enterprise revenue missed quota by -24.7% ($64,000 realized vs $85,000 target). Customer satisfaction dropped to 3.5/5.0 following 2 key accounts defecting to competitors.\n3. LATAM Enterprise Slump: Realized only $15,000 vs $30,000 target (-50% deficit) due to banking budget freezes in Brazil.\n\nRecommended Action Plan:\n- Customer Success to initiate emergency health check with top 5 EMEA accounts.\n- Review LATAM pricing concession tiers to unfreeze delayed renewals.\n- Allocate additional sales engineering coverage to Frankfurt/London.\n\nPlease review the attached data metrics and approve remediation task assignments.\n\nBest regards,\nMojaFlow AI Autonomous Operations`,
          affectedRecords: 10,
          tasksCount: 4,
        },
        status: 'pending',
      },
      attachedFile: {
        name: defaultSample.name,
        size: defaultSample.size,
        type: defaultSample.type,
        rawContent: defaultSample.content,
      },
      artifacts: {
        email: {
          id: 'email-1',
          recipient: 'vp-sales@enterprise.corp, cro@enterprise.corp',
          cc: 'growth-ops@enterprise.corp',
          subject: '[ACTION REQUIRED] Q3 Revenue Variance Alert: EMEA Enterprise Churn & LATAM Shortfall',
          body: `Executive Leadership Team,\n\nOur automated weekly anomaly audit of Q3 sales data revealed two significant negative variances requiring immediate operational response:\n\n1. Revenue Shortfall: Total quarterly revenue stands at $523,000 against our $547,000 target (-4.4% net deficit, -$24,000 gap).\n2. Critical EMEA Enterprise Churn: EMEA Enterprise revenue missed quota by -24.7% ($64,000 realized vs $85,000 target). Customer satisfaction dropped to 3.5/5.0 following 2 key accounts defecting to competitors.\n3. LATAM Enterprise Slump: Realized only $15,000 vs $30,000 target (-50% deficit) due to banking budget freezes in Brazil.\n\nRecommended Action Plan:\n- Customer Success to initiate emergency health check with top 5 EMEA accounts.\n- Review LATAM pricing concession tiers to unfreeze delayed renewals.\n- Allocate additional sales engineering coverage to Frankfurt/London.\n\nPlease review the attached data metrics and approve remediation task assignments.\n\nBest regards,\nMojaFlow AI Autonomous Operations`,
          urgency: 'high_priority',
          generatedAt: '10:42 AM',
          status: 'draft',
        },
        dataAnalysis: {
          title: 'Quarterly Performance Breakdown - sales_q3_report.csv',
          datasetName: 'sales_q3_report.csv',
          metrics: [
            { label: 'Gross Realized Revenue', value: '$523,000', change: '-4.4% vs quota', trend: 'down', flag: 'warning' },
            { label: 'Performance Target', value: '$547,000', change: 'Quarterly target', trend: 'neutral' },
            { label: 'Total Units Sold', value: '1,684', change: '+14.2% YoY', trend: 'up', flag: 'positive' },
            { label: 'Customer Health Index', value: '4.1 / 5.0', change: '2 critical churn flags', trend: 'down', flag: 'critical' },
          ],
          chartData: [
            { label: 'North America', value: 218500, target: 215000 },
            { label: 'EMEA', value: 141000, target: 157000 },
            { label: 'APAC', value: 133000, target: 145000 },
            { label: 'LATAM', value: 30500, target: 50000 },
          ],
          insights: [
            'Aggregate quarterly revenue reached $523,000, underperforming quota by $24,000 (-4.4%).',
            'Severe contraction concentrated in EMEA Enterprise ($64K vs $85K target) with customer satisfaction dropping to 3.5/5.0.',
            'LATAM Enterprise suffered -50% shortfall due to macroeconomic banking budget freezes in Brazil.',
            'Starter & Team tiers overperformed (+18% volume), mitigating enterprise enterprise loss.',
          ],
          anomalies: [
            {
              item: 'EMEA (MojaFlow Enterprise)',
              severity: 'critical',
              detail: 'Severe revenue shortfall (-24.7% vs quota) accompanied by 2 high-value account cancellations to competitors.',
            },
            {
              item: 'LATAM (MojaFlow Enterprise)',
              severity: 'critical',
              detail: 'Realized only $15,000 against a $30,000 quota (-50% deficit) due to regional currency/budget freeze.',
            },
            {
              item: 'North America (MojaFlow Team)',
              severity: 'warning',
              detail: 'Temporary dip in August ($55,500 vs $65,000 target) following pricing tier migration.',
            },
          ],
          tableData: {
            columns: ['Date', 'Region', 'Product', 'Units', 'Revenue', 'Target', 'Rating'],
            rows: [
              ['2026-07-05', 'North America', 'MojaFlow Enterprise', '142', '$142,000', '$130,000', '4.8'],
              ['2026-07-12', 'EMEA', 'MojaFlow Team', '210', '$63,000', '$60,000', '4.6'],
              ['2026-07-20', 'APAC', 'MojaFlow Enterprise', '88', '$88,000', '$95,000', '4.2'],
              ['2026-08-02', 'LATAM', 'MojaFlow Starter', '310', '$15,500', '$20,000', '4.1'],
              ['2026-08-10', 'North America', 'MojaFlow Team', '185', '$55,500', '$65,000', '3.9'],
              ['2026-08-18', 'EMEA', 'MojaFlow Enterprise', '64', '$64,000', '$85,000', '3.5'],
              ['2026-08-25', 'North America', 'MojaFlow Starter', '420', '$21,000', '$20,000', '4.7'],
              ['2026-09-02', 'APAC', 'MojaFlow Team', '150', '$45,000', '$50,000', '4.3'],
              ['2026-09-12', 'EMEA', 'MojaFlow Starter', '280', '$14,000', '$12,000', '4.5'],
              ['2026-09-20', 'LATAM', 'MojaFlow Enterprise', '15', '$15,000', '$30,000', '3.2'],
            ],
          },
        },
        kanban: {
          boardTitle: 'Q3 Sales Anomaly Remediation Plan',
          exportedAt: 'Sep 23, 2026',
          tasks: [
            {
              id: 'TSK-101',
              title: 'Schedule EMEA At-Risk Customer Interventions',
              description: 'Executive sync with 2 churned accounts and 3 accounts with CSAT < 3.8 in DACH region.',
              status: 'in_progress',
              priority: 'urgent',
              assignee: 'Elena Rostova (CS Director)',
              tag: 'Customer Health',
              dueDate: 'Tomorrow, 5:00 PM',
            },
            {
              id: 'TSK-102',
              title: 'Revise LATAM Enterprise Contract Thresholds',
              description: 'Introduce local currency protection clauses or flexible quarterly billing for Brazilian clients.',
              status: 'todo',
              priority: 'high',
              assignee: 'Carlos Mendez (Finance)',
              tag: 'Pricing & Billing',
              dueDate: 'Sep 28, 2026',
            },
            {
              id: 'TSK-103',
              title: 'Competitor Win-Loss Postmortem',
              description: 'Document feature gaps or pricing advantages cited in the 2 lost EMEA enterprise accounts.',
              status: 'todo',
              priority: 'medium',
              assignee: 'Product Marketing',
              tag: 'Intelligence',
              dueDate: 'Oct 02, 2026',
            },
            {
              id: 'TSK-104',
              title: 'Review North America Team Tier Migration Telemetry',
              description: 'Analyze self-serve conversion funnel after August pricing changes.',
              status: 'review',
              priority: 'medium',
              assignee: 'Growth Analytics',
              tag: 'Growth',
              dueDate: 'Sep 30, 2026',
            },
          ],
        },
        webResearch: {
          queries: [
            'EMEA enterprise SaaS retention trends Q3',
            'Enterprise software procurement delays Brazil LATAM 2026',
          ],
          findings: [
            {
              query: 'EMEA enterprise SaaS retention trends Q3',
              sourceUrl: 'https://research.analyst-insights.net/saas-q3-churn',
              title: 'Macro Headwinds Soften European Enterprise Expansion',
              snippet: 'Average net retention among enterprise software vendors in EMEA contracted by 3.8% in Q3 due to scrutiny on secondary seat licenses.',
              confidenceScore: 0.94,
            },
            {
              query: 'Enterprise software procurement delays Brazil LATAM 2026',
              sourceUrl: 'https://tech-latam.org/procurement-index-2026',
              title: 'LATAM Corporate IT Budgets Face Forex Pressures',
              snippet: '62% of surveyed finance leaders in São Paulo and Mexico City delayed multi-year foreign currency software commitments until Q4 audit completion.',
              confidenceScore: 0.89,
            },
          ],
          synthesis: 'Internal anomaly data aligns with regional macroeconomic trends. Churn was not product defect driven, but price/currency sensitivity combined with targeted competitor discount maneuvers.',
        },
        summaryReport: `## Executive Resolution Summary\n\n- **Target Dataset:** sales_q3_report.csv\n- **Total Revenue:** $523,000 vs $547,000 Target (-$24,000 variance, -4.4% deficit)\n- **Primary Culprits:** EMEA Enterprise churn (-24.7% vs quota, CSAT 3.5) and LATAM Enterprise (-50% vs quota).\n- **Market Context:** Corroborated with European macro reports indicating lengthened procurement and localized competitor pricing attacks.\n- **Human Safety Status:** Email draft generated and on hold awaiting operator approval.`,
      },
    };

    setSessions([defaultSession]);
    setCurrentSessionId(initialSessionId);
  }, []);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const isRunning = currentSession?.status === 'running' || currentSession?.status === 'planning';

  const handleToggleTool = (toolId: ToolDefinition['id']) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleRunTask = async (prompt: string, attachedFile?: AttachedFile) => {
    const sessionId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const initialSession: TaskSession = {
      id: sessionId,
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      prompt,
      status: 'planning',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMs: 0,
      plan: [],
      steps: [],
      currentStepIndex: 0,
      artifacts: {},
      attachedFile,
    };

    setSessions((prev) => [initialSession, ...prev.filter((s) => s.id !== sessionId)]);
    setCurrentSessionId(sessionId);

    try {
      const completedSession = await executeAgentTask(
        sessionId,
        prompt,
        attachedFile,
        tools,
        (update) => {
          setSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? { ...s, ...update, id: sessionId } : s))
          );
        }
      );

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...completedSession, id: sessionId } : s))
      );
    } catch (err) {
      console.error('Task run failed:', err);
    }
  };

  const handleApproveSafety = (updatedPayload?: any) => {
    if (!currentSession || !currentSession.activeApproval) return;

    const approvalStep: AgentStep = {
      id: `step-approval-granted-${Date.now()}`,
      phase: 'approval',
      title: 'Human-in-the-Loop Approval Granted',
      content: `User verified and authorized external dispatch payload. Authorizing production mail server relay for "${currentSession.activeApproval.payload.subject}".`,
      timestamp: new Date().toLocaleTimeString(),
      durationMs: 120,
    };

    const finalStep: AgentStep = {
      id: `step-final-${Date.now()}`,
      phase: 'final',
      title: 'Cycle Complete: Outbound Dispatch Confirmed',
      content: 'Action Dispatcher released email notification and synchronized remediation tasks to production Kanban database. Agent workflow concluded successfully.',
      timestamp: new Date().toLocaleTimeString(),
      durationMs: 240,
    };

    const updatedSession: TaskSession = {
      ...currentSession,
      status: 'completed',
      activeApproval: undefined,
      steps: [...currentSession.steps, approvalStep, finalStep],
      artifacts: {
        ...currentSession.artifacts,
        email: currentSession.artifacts.email ? {
          ...currentSession.artifacts.email,
          status: 'approved_ready',
          ...(updatedPayload ? {
            recipient: updatedPayload.recipient,
            subject: updatedPayload.subject,
            body: updatedPayload.body,
          } : {}),
        } : undefined,
      },
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
    );
  };

  const handleRejectSafety = (reason: string) => {
    if (!currentSession) return;

    const rejectionStep: AgentStep = {
      id: `step-approval-rejected-${Date.now()}`,
      phase: 'approval',
      title: 'Action Rejected by Operator',
      content: `Operator withheld dispatch approval. Reason: "${reason}". Execution halted safely without releasing external side-effects.`,
      timestamp: new Date().toLocaleTimeString(),
      durationMs: 80,
    };

    const updatedSession: TaskSession = {
      ...currentSession,
      status: 'rejected',
      activeApproval: undefined,
      steps: [...currentSession.steps, rejectionStep],
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
    );
  };

  const handleNewTask = () => {
    const newSessionId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newSession: TaskSession = {
      id: newSessionId,
      title: 'New Autonomous Task',
      prompt: '',
      status: 'idle',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMs: 0,
      plan: [],
      steps: [],
      currentStepIndex: 0,
      artifacts: {},
    };
    setSessions((prev) => [newSession, ...prev.filter((s) => s.id !== newSessionId)]);
    setCurrentSessionId(newSessionId);
  };

  const activeToolsCount = tools.filter((t) => t.enabled).length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        currentStatus={currentSession?.status || 'idle'}
        activeToolsCount={activeToolsCount}
        totalToolsCount={tools.length}
        onNewTask={handleNewTask}
        taskTitle={currentSession?.title}
      />

      {/* Main Body Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={(id) => setCurrentSessionId(id)}
          tools={tools}
          onToggleTool={handleToggleTool}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
        />

        {/* Center / Right Execution Viewport */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#090d16] overflow-hidden">
          {/* Top Command Area */}
          <CommandInput
            onRunTask={handleRunTask}
            isRunning={isRunning}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
          />

          {/* View Mode Toggle Controls */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-[#0c101b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Workspace Panels:
              </span>
              <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    viewMode === 'split'
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Split View</span>
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    viewMode === 'timeline'
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>ReAct Timeline</span>
                </button>
                <button
                  onClick={() => setViewMode('artifacts')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    viewMode === 'artifacts'
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Artifacts Preview</span>
                </button>
              </div>
            </div>

            {currentSession && (
              <div className="text-xs font-mono text-slate-400">
                Steps: {currentSession.steps.length} | Plan: {currentSession.plan.length} subtasks
              </div>
            )}
          </div>

          {/* Human-in-the-Loop Safety Alert Card if actively waiting */}
          {currentSession?.status === 'waiting_approval' && currentSession.activeApproval && (
            <ApprovalCard
              request={currentSession.activeApproval}
              onApprove={handleApproveSafety}
              onReject={handleRejectSafety}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'split' ? (
              <div className="h-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 overflow-hidden">
                {/* Left Split Panel: Live ReAct Timeline */}
                <div className="h-full overflow-hidden flex flex-col">
                  <div className="p-2.5 px-4 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Live ReAct Execution Timeline</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Thought → Action → Observation Loop
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ExecutionTimeline
                      plan={currentSession?.plan || []}
                      steps={currentSession?.steps || []}
                      isRunning={isRunning}
                      currentStepIndex={currentSession?.currentStepIndex || 0}
                    />
                  </div>
                </div>

                {/* Right Split Panel: Artifacts Preview */}
                <div className="h-full overflow-hidden flex flex-col">
                  <div className="p-2.5 px-4 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Resolved Artifacts & Output Preview</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Interactive Email, Analytics & Kanban
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ArtifactsView
                      artifacts={currentSession?.artifacts || {}}
                      isApprovalPending={currentSession?.status === 'waiting_approval'}
                    />
                  </div>
                </div>
              </div>
            ) : viewMode === 'timeline' ? (
              <div className="h-full overflow-hidden">
                <ExecutionTimeline
                  plan={currentSession?.plan || []}
                  steps={currentSession?.steps || []}
                  isRunning={isRunning}
                  currentStepIndex={currentSession?.currentStepIndex || 0}
                />
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                <ArtifactsView
                  artifacts={currentSession?.artifacts || {}}
                  isApprovalPending={currentSession?.status === 'waiting_approval'}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sample Dataset Selector Modal */}
      <SampleDataModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={(sampleFile) => {
          handleRunTask(
            `Analyze ${sampleFile.name}, identify anomalies and negative trends, and formulate executive recommendations`,
            sampleFile
          );
        }}
      />
    </div>
  );
}
