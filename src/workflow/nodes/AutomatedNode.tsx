import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { AutomatedNodeData } from '../types';
import { NodeContainer } from './NodeContainer';

export function AutomatedNode({ data }: NodeProps<AutomatedNodeData>) {
  return (
    <NodeContainer type="automated" hasError={data.hasError}>
      <div className="mb-1 flex items-center justify-between">
        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
          Automated
        </span>
      </div>
      <div className="text-xs font-semibold text-gray-800">{data.label}</div>
      <div className="mt-0.5 text-[10px] text-gray-500">
        Action: {data.actionId || 'Not set'}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}
