import type { Edge, Node } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  id: string;
  type: NodeType;
  label: string;
  hasError?: boolean;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  approverRole: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId?: string;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage?: string;
  summaryEnabled: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

/* Mock automations */

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

/* Simulation result types */

export type SimulationStepStatus = 'pending' | 'success' | 'warning' | 'error';

export interface SimulationStep {
  index: number;
  nodeId: string;
  nodeLabel: string;
  nodeType: NodeType;
  status: SimulationStepStatus;
  message: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
  warnings: string[];
}
