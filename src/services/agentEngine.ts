import type { TaskSession, AttachedFile, ToolDefinition, AgentStep } from '../types.ts';
import { fallbackAgentExecution } from '../server/agentLogic.ts';

export async function executeAgentTask(
  sessionId: string,
  prompt: string,
  attachedFile: AttachedFile | undefined,
  tools: ToolDefinition[],
  onStepProgress: (sessionUpdate: Partial<TaskSession>) => void
): Promise<TaskSession> {
  const enabledToolIds = tools.filter(t => t.enabled).map(t => t.id);

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

  onStepProgress(initialSession);

  // Call server-side API endpoint
  let result: any = null;
  try {
    const res = await fetch('/api/agent/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        attachedFile,
        enabledTools: enabledToolIds,
      }),
    });

    if (res.ok) {
      result = await res.json();
    } else {
      console.warn('Backend API returned non-200, using client fallback engine');
      result = fallbackAgentExecution({
        prompt,
        attachedFile,
        enabledTools: enabledToolIds,
      });
    }
  } catch (err) {
    console.warn('Fetch to /api/agent/run failed, executing client fallback engine:', err);
    result = fallbackAgentExecution({
      prompt,
      attachedFile,
      enabledTools: enabledToolIds,
    });
  }

  // Animate the progression through the ReAct loop so the user observes each Thought -> Action -> Observation!
  const allSteps: AgentStep[] = result.reactSteps || [];
  const activePlan = result.plan || [];

  onStepProgress({
    id: sessionId,
    status: 'running',
    plan: activePlan,
    artifacts: {
      dataAnalysis: result.artifacts?.dataAnalysis,
    }
  });

  const accumulatedSteps: AgentStep[] = [];

  for (let i = 0; i < allSteps.length; i++) {
    const step = allSteps[i];
    accumulatedSteps.push(step);

    onStepProgress({
      id: sessionId,
      steps: [...accumulatedSteps],
      currentStepIndex: i,
    });

    // Check if this step is a Human-in-the-Loop Safety gate
    if (step.isApprovalRequired && result.approvalRequest) {
      onStepProgress({
        id: sessionId,
        status: 'waiting_approval',
        activeApproval: result.approvalRequest,
        steps: [...accumulatedSteps],
        artifacts: result.artifacts,
      });
      // Pause here and return the session waiting for user interaction!
      return {
        ...initialSession,
        status: 'waiting_approval',
        plan: activePlan,
        steps: accumulatedSteps,
        currentStepIndex: i,
        activeApproval: result.approvalRequest,
        artifacts: result.artifacts,
        finalAnswer: result.finalAnswer,
      };
    }

    // Small realistic delay between steps to create smooth live visualization
    await new Promise((r) => setTimeout(r, 450));
  }

  // Completed without approval halt
  const finalSession: TaskSession = {
    ...initialSession,
    status: 'completed',
    plan: activePlan,
    steps: accumulatedSteps,
    currentStepIndex: accumulatedSteps.length - 1,
    artifacts: result.artifacts || {},
    finalAnswer: result.finalAnswer,
  };

  onStepProgress(finalSession);
  return finalSession;
}
