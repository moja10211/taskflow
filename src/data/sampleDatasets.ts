export interface SampleFile {
  name: string;
  type: 'csv' | 'json' | 'txt';
  description: string;
  size: string;
  content: string;
}

export const SAMPLE_DATASETS: SampleFile[] = [
  {
    name: 'sales_q3_report.csv',
    type: 'csv',
    description: 'Quarterly regional sales breakdown with targets, revenue, and customer ratings',
    size: '1.2 KB',
    content: `Date,Region,Product,Units_Sold,Revenue,Target,Customer_Rating,Notes
2026-07-05,North America,MojaFlow Enterprise,142,142000,130000,4.8,Q3 Kickoff strong enterprise demand
2026-07-12,EMEA,MojaFlow Team,210,63000,60000,4.6,Consistent SMB adoption in DACH region
2026-07-20,APAC,MojaFlow Enterprise,88,88000,95000,4.2,Supply delay in Tokyo datacenter deployment
2026-08-02,LATAM,MojaFlow Starter,310,15500,20000,4.1,Currency fluctuation impact in Brazil
2026-08-10,North America,MojaFlow Team,185,55500,65000,3.9,Slump due to tier migration confusion
2026-08-18,EMEA,MojaFlow Enterprise,64,64000,85000,3.5,Enterprise churn alert: 2 key accounts moved to competitor
2026-08-25,North America,MojaFlow Starter,420,21000,20000,4.7,Viral growth on developer Twitter/X
2026-09-02,APAC,MojaFlow Team,150,45000,50000,4.3,Market stabilizing after partner rollout
2026-09-12,EMEA,MojaFlow Starter,280,14000,12000,4.5,Exceeded target via marketing campaign
2026-09-20,LATAM,MojaFlow Enterprise,15,15000,30000,3.2,Severe budget freeze in enterprise fintech sector`
  },
  {
    name: 'server_incident_logs.json',
    type: 'json',
    description: 'Production infrastructure telemetry, service errors, and failover latency',
    size: '1.8 KB',
    content: JSON.stringify([
      {
        "id": "INC-8812",
        "service": "auth-gateway",
        "severity": "CRITICAL",
        "error_code": "504_GATEWAY_TIMEOUT",
        "latency_ms": 3420,
        "region": "us-east-1",
        "impact": "1,420 users experienced delayed JWT verification",
        "timestamp": "2026-09-22T08:12:00Z",
        "root_cause": "Database connection pool exhausted during 3x traffic surge"
      },
      {
        "id": "INC-8813",
        "service": "billing-dispatcher",
        "severity": "HIGH",
        "error_code": "429_RATE_LIMIT",
        "latency_ms": 480,
        "region": "eu-west-1",
        "impact": "Webhook queue backlog rose to 4,200 pending events",
        "timestamp": "2026-09-22T08:45:22Z",
        "root_cause": "Downstream payment processor throttled concurrent bursts"
      },
      {
        "id": "INC-8814",
        "service": "agent-worker-pool",
        "severity": "CRITICAL",
        "error_code": "OOM_POD_EVICTION",
        "latency_ms": 8900,
        "region": "us-east-1",
        "impact": "18 active CSV transformation jobs restarted",
        "timestamp": "2026-09-22T09:10:15Z",
        "root_cause": "Node worker-08 hit memory threshold processing 150MB unstructured log"
      },
      {
        "id": "INC-8815",
        "service": "vector-search-index",
        "severity": "LOW",
        "error_code": "RETRY_LATENCY",
        "latency_ms": 320,
        "region": "ap-southeast-1",
        "impact": "Nominal, automatic failover to read replica succeeded",
        "timestamp": "2026-09-22T10:04:30Z",
        "root_cause": "Transient network jitter in Singapore transit provider"
      }
    ], null, 2)
  },
  {
    name: 'customer_feedback_survey.csv',
    type: 'csv',
    description: 'Post-launch feedback sentiment, NPS scores, and requested enhancements',
    size: '1.4 KB',
    content: `Respondent_ID,Role,Company_Size,Category,NPS_Score,Comment,Priority
US-102,VP of Engineering,500+,Safety & Approvals,9,"Love the Human-in-the-Loop approval step. Prevents accidental dispatches.",High
EU-204,Product Ops,50-200,Data Analyzer,8,"The CSV anomaly detector saved us 3 hours preparing the weekly board memo.",Medium
AP-309,Lead Data Scientist,200-500,Tool Dispatcher,4,"Need faster export directly to our Jira/Linear Kanban boards.",High
US-115,DevOps Lead,1000+,Reliability,10,"Real-time ReAct loop visualization makes debugging agent thoughts intuitive.",Low
LAT-401,Finance Controller,20-50,Billing,6,"Exporting charts to PDF or email draft works smoothly but need CSV raw download.",Medium`
  }
];
