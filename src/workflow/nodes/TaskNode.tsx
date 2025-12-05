import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { TaskNodeData } from '../types';
import { NodeContainer } from './NodeContainer';

export function TaskNode({ data }: NodeProps<TaskNodeData>) {
  return (
    <NodeContainer type="task" hasError={data.hasError}>
      <div className="mb-1 flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Task
        </span>
      </div>
      <div className="text-xs font-semibold text-gray-800">{data.label}</div>
      {data.assignee && (
        <div className="mt-0.5 text-[10px] text-gray-500">
          Assignee: {data.assignee}
        </div>
      )}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}
