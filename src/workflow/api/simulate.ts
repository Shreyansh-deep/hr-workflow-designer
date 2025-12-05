import type {
    SimulationResult,
    SimulationStep,
    WorkflowGraph,
    WorkflowNodeData,
  } from '../types';
  
  function describeNode(data: WorkflowNodeData): string {
    switch (data.type) {
      case 'start':
        return `Start workflow: ${data.label}`;
      case 'task':
        return `Task for ${data.assignee || 'unassigned'}: ${data.label}`;
      case 'approval':
        return `Approval by ${data.approverRole || 'Unknown role'}: ${data.label}`;
      case 'automated':
        return `Automated action ${data.actionId || 'not selected'}: ${data.label}`;
      case 'end':
        return `End workflow: ${data.endMessage || data.label}`;
      default:
        return data.label;
    }
  }
  
  // naive topological-style walk from any Start node
  export async function simulateWorkflow(graph: WorkflowGraph): Promise<SimulationResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  
    const { nodes, edges } = graph;
  
    const start = nodes.find((n) => n.data.type === 'start');
    const steps: SimulationStep[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
  
    if (!start) {
      errors.push('No Start node found.');
      return { success: false, steps: [], errors, warnings };
    }
  
    // BFS from start along outgoing edges
    const visited = new Set<string>();
    const queue: string[] = [start.id];
  
    let idx = 1;
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
  
      const node = nodes.find((n) => n.id === id);
      if (!node) continue;
  
      const description = describeNode(node.data as WorkflowNodeData);
      const status: SimulationStep['status'] =
        node.data.type === 'automated' && !(node.data as any).actionId
          ? 'warning'
          : 'success';
  
      if (status === 'warning') {
        warnings.push(`Automated node "${node.data.label}" has no selected action.`);
      }
  
      steps.push({
        index: idx++,
        nodeId: node.id,
        nodeLabel: node.data.label,
        nodeType: node.data.type,
        status,
        message: description,
      });
  
      const outgoing = edges.filter((e) => e.source === id).map((e) => e.target);
      queue.push(...outgoing);
    }
  
    return {
      success: errors.length === 0,
      steps,
      errors,
      warnings,
    };
  }
  