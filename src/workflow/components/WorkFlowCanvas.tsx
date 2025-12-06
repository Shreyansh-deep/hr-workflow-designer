import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from 'reactflow';
import type { NodeTypes, Connection, EdgeChange, NodeChange, OnConnectStartParams } from 'reactflow';

import 'reactflow/dist/style.css';

import { useWorkflow, createNodeId } from '../WorkflowProvider';
import type {
  AutomatedNodeData,
  EndNodeData,
  NodeType,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  WorkflowNode,
} from '../types';
import { StartNode } from '../nodes/StartNode';
import { TaskNode } from '../nodes/TaskNode';
import { ApprovalNode } from '../nodes/ApprovalNode';
import { AutomatedNode } from '../nodes/AutomatedNode';
import { EndNode } from '../nodes/EndNode';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

export function WorkflowCanvas() {
  const { project } = useReactFlow();
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    setSelectedNodeId,
    clearNodeErrors,
  } = useWorkflow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: false }, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: WorkflowNode) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const createInitialData = (type: NodeType): any => {
    const base = {
      id: '',
      type,
      label:
        type === 'start'
          ? 'Start'
          : type === 'task'
          ? 'Task'
          : type === 'approval'
          ? 'Approval'
          : type === 'automated'
          ? 'Automated Step'
          : 'End',
      hasError: false,
    };

    switch (type) {
      case 'start':
        return {
          ...(base as StartNodeData),
          metadata: {},
        };
      case 'task':
        return {
          ...(base as TaskNodeData),
          description: '',
          assignee: '',
          dueDate: '',
          customFields: {},
        };
      case 'approval':
        return {
          ...(base as ApprovalNodeData),
          approverRole: '',
          autoApproveThreshold: undefined,
        };
      case 'automated':
        return {
          ...(base as AutomatedNodeData),
          actionId: '',
          params: {},
        };
      case 'end':
        return {
          ...(base as EndNodeData),
          endMessage: '',
          summaryEnabled: true,
        };
      default:
        return base;
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData(
      'application/hr-node-type',
    ) as NodeType;
    if (!type) return;

    if (type === 'start' && nodes.some((n) => n.data.type === 'start')) {
      return;
    }

    const position = project({
      x: event.clientX,
      y: event.clientY,
    });

    const id = createNodeId();
    const data = createInitialData(type);
    data.id = id;

    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data,
    };

    clearNodeErrors();
    setNodes((nds) => nds.concat(newNode));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    // Edge deletion is handled by onEdgesChange; here we only care about nodes
    if (event.key === 'Delete' || event.key === 'Backspace') {
      // handled in NodeConfigPanel (delete button) – here noop to avoid confusion
    }
  };

  const onConnectStart = () => {
    clearNodeErrors();
  };

  return (
    <div className="h-full w-full" onKeyDown={onKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background gap={16} color="#e5e7eb" />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}
