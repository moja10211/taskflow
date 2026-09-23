export type AgentPhase = 'plan' | 'thought' | 'action' | 'observation' | 'approval' | 'final';

export type TaskStatus = 
  | 'idle'
  | 'planning'
  | 'running'
  | 'waiting_approval'
  | 'completed'
  | 'rejected'
  | 'failed';

export interface PlanSubTask {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  toolTarget: 'file_reader' | 'data_analyzer' | 'web_researcher' | 'action_dispatcher';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
}

export interface AgentStep {
  id: string;
  phase: AgentPhase;
  title: string;
  content: string;
  subtaskId?: string;
  tool?: 'file_reader' | 'data_analyzer' | 'web_researcher' | 'action_dispatcher';
  toolInput?: Record<string, any>;
  toolOutput?: any;
  durationMs?: number;
  timestamp: string;
  isApprovalRequired?: boolean;
}

export interface ApprovalRequest {
  id: string;
  actionType: 'send_email' | 'delete_data' | 'api_dispatch' | 'system_write';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  target: string;
  payload: {
    recipient?: string;
    subject?: string;
    body?: string;
    systemEndpoint?: string;
    affectedRecords?: number;
    tasksCount?: number;
    metadata?: Record<string, any>;
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface EmailArtifact {
  id: string;
  recipient: string;
  cc?: string;
  subject: string;
  body: string;
  urgency: 'routine' | 'urgent' | 'high_priority';
  generatedAt: string;
  status: 'draft' | 'approved_ready' | 'dispatched';
}

export interface DataMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  flag?: 'positive' | 'warning' | 'critical';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  target?: number;
  secondary?: number;
}

export interface DataAnalysisArtifact {
  title: string;
  datasetName: string;
  metrics: DataMetric[];
  chartData: ChartDataPoint[];
  insights: string[];
  anomalies: {
    item: string;
    severity: 'critical' | 'warning' | 'info';
    detail: string;
  }[];
  tableData?: {
    columns: string[];
    rows: (string | number)[][];
  };
}

export interface KanbanTaskItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  tag: string;
  dueDate?: string;
}

export interface KanbanArtifact {
  boardTitle: string;
  tasks: KanbanTaskItem[];
  exportedAt: string;
}

export interface WebResearchItem {
  query: string;
  sourceUrl: string;
  title: string;
  snippet: string;
  confidenceScore: number;
}

export interface WebResearchArtifact {
  queries: string[];
  findings: WebResearchItem[];
  synthesis: string;
}

export interface AgentArtifacts {
  email?: EmailArtifact;
  dataAnalysis?: DataAnalysisArtifact;
  kanban?: KanbanArtifact;
  webResearch?: WebResearchArtifact;
  summaryReport?: string;
}

export interface AttachedFile {
  name: string;
  size: string;
  type: 'csv' | 'json' | 'txt' | 'other';
  rawContent: string;
  parsedSummary?: {
    rowCount: number;
    columns: string[];
    sampleRows: any[];
  };
}

export interface ToolDefinition {
  id: 'file_reader' | 'data_analyzer' | 'web_researcher' | 'action_dispatcher';
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  requiresSafetyGate: boolean;
  capabilities: string[];
}

export interface TaskSession {
  id: string;
  title: string;
  prompt: string;
  status: TaskStatus;
  createdAt: string;
  durationMs: number;
  plan: PlanSubTask[];
  steps: AgentStep[];
  currentStepIndex: number;
  activeApproval?: ApprovalRequest;
  artifacts: AgentArtifacts;
  attachedFile?: AttachedFile;
  finalAnswer?: string;
}
