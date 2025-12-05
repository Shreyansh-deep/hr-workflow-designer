import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { StartNodeData } from '../types';
import { NodeContainer } from './NodeContainer';

export function StartNode({ data }: NodeProps<StartNodeData>) {
  return (
    <NodeContainer type="start" hasError={data.hasError}>
      <div className="mb-1 flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
          Start
        </span>
      </div>
      <div className="text-xs font-semibold text-gray-800">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}
