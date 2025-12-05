import React, { createContext, useContext, useState } from 'react';
import type {
  WorkflowEdge,
  WorkflowGraph,
  WorkflowNode,
  WorkflowNodeData,
} from './types';

interface WorkflowContextValue {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<WorkflowEdge[]>>;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, patch: Partial<WorkflowNodeData>) => void;
  deleteSelectedNode: () => void;
  markErrorNodes: (ids: string[]) => void;
  clearNodeErrors: () => void;
  toGraph: () => WorkflowGraph;
}

const WorkflowContext = createContext<WorkflowContextValue | undefined>(
  undefined,
);

let nodeIdCounter = 1;
export function createNodeId() {
  return `node_${nodeIdCounter++}`;
}

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const updateNodeData = (id: string, patch: Partial<WorkflowNodeData>) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...patch,
              },
            }
          : node,
      ),
    );
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) =>
      prev.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
      ),
    );
    setSelectedNodeId(null);
  };

  const markErrorNodes = (ids: string[]) => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: {
          ...n.data,
          hasError: ids.includes(n.id),
        },
      })),
    );
  };

  const clearNodeErrors = () => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: {
          ...n.data,
          hasError: false,
        },
      })),
    );
  };

  const toGraph = (): WorkflowGraph => ({ nodes, edges });

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        selectedNodeId,
        setNodes,
        setEdges,
        setSelectedNodeId,
        updateNodeData,
        deleteSelectedNode,
        markErrorNodes,
        clearNodeErrors,
        toGraph,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return ctx;
}
