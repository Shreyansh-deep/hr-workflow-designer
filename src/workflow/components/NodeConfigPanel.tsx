import { useWorkflow } from '../WorkflowProvider';
import type {
  AutomatedNodeData,
  ApprovalNodeData,
  EndNodeData,
  StartNodeData,
  TaskNodeData,
  WorkflowNodeData,
} from '../types';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedNodeForm } from './forms/AutomatedNodeForm';
import { EndNodeForm } from './forms/EndNodeForm';

export function NodeConfigPanel() {
  const { nodes, selectedNodeId, updateNodeData, deleteSelectedNode } =
    useWorkflow();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleChange = (patch: Partial<WorkflowNodeData>) => {
    if (!selectedNode) return;
    updateNodeData(selectedNode.id, patch);
  };

  return (
    <div className="flex-1 overflow-auto px-4 py-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Node Configuration
      </h2>

      {!selectedNode && (
        <p className="text-xs text-gray-500">
          Select a node on the canvas to edit its configuration.
        </p>
      )}

      {selectedNode && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-800">
                {selectedNode.data.label || 'Untitled Node'}
              </div>
              <div className="text-[10px] uppercase text-gray-400">
                {selectedNode.data.type} node
              </div>
            </div>
            <button
              onClick={deleteSelectedNode}
              className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100"
            >
              Delete Node
            </button>
          </div>

          <div className="space-y-3">
            {/* Shared label field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-gray-600">
                Title
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                value={selectedNode.data.label}
                onChange={(e) => handleChange({ label: e.target.value })}
                placeholder="Node title"
              />
            </div>

            {/* Type-specific forms */}
            {selectedNode.data.type === 'start' && (
              <StartNodeForm
                data={selectedNode.data as StartNodeData}
                onChange={handleChange}
              />
            )}
            {selectedNode.data.type === 'task' && (
              <TaskNodeForm
                data={selectedNode.data as TaskNodeData}
                onChange={handleChange}
              />
            )}
            {selectedNode.data.type === 'approval' && (
              <ApprovalNodeForm
                data={selectedNode.data as ApprovalNodeData}
                onChange={handleChange}
              />
            )}
            {selectedNode.data.type === 'automated' && (
              <AutomatedNodeForm
                data={selectedNode.data as AutomatedNodeData}
                onChange={handleChange}
              />
            )}
            {selectedNode.data.type === 'end' && (
              <EndNodeForm
                data={selectedNode.data as EndNodeData}
                onChange={handleChange}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
