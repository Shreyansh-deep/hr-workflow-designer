import type {
  SimulationResult,
  SimulationStep,
  WorkflowGraph,
  WorkflowNodeData,
} from '../types';

// Type guard to guarantee node data has a "label" field
function hasLabel(data: any): data is WorkflowNodeData & { label: string } {
  return typeof data?.label === 'string';
}

function describeNode(data: WorkflowNodeData): string {
  switch (data.type) {
    case 'start':
      return `Start: ${data.label}`;
    case 'task':
      return `Task: ${data.label}`;
    case 'approval':
      return `Approval: ${data.label}`;
    case 'automated':
      return `Automated: ${data.label}`;
    case 'end':
      return `End: ${data.endMessage || data.label}`;
    default:
      return 'Unknown step';
  }
}

export async function simulateWorkflow(
  graph: WorkflowGraph,
): Promise<SimulationResult> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const { nodes, edges } = graph;
  const errors: string[] = [];
  const warnings: string[] = [];
  const steps: SimulationStep[] = [];

  const start = nodes.find((n) => n.data.type === 'start');
  if (!start) {
    return { success: false, steps: [], errors: ['Missing Start node'], warnings };
  }

  const visited = new Set<string>();
  const queue = [start.id];

  let index = 1;
  while (queue.length) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    if (!hasLabel(node.data)) {
      errors.push(`Node ${node.id} missing label`);
      continue;
    }

    let status: SimulationStep['status'] = 'success';
    if (node.data.type === 'automated' && !('actionId' in node.data && node.data.actionId)) {
      warnings.push(`Automated node "${node.data.label}" has no action selected`);
      status = 'warning';
    }

    steps.push({
      index,
      nodeId: node.id,
      nodeLabel: node.data.label,
      nodeType: node.data.type,
      status,
      message: describeNode(node.data),
    });
    index++;

    const outgoing = edges.filter((e) => e.source === currentId).map((e) => e.target);
    queue.push(...outgoing);
  }

  return {
    success: errors.length === 0,
    steps,
    errors,
    warnings,
  };
}
