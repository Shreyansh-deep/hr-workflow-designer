import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { EndNodeData } from '../types';
import { NodeContainer } from './NodeContainer';

export function EndNode({ data }: NodeProps<EndNodeData>) {
  return (
    <NodeContainer type="end" hasError={data.hasError}>
      <div className="mb-1 flex items-center justify-between">
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
          End
        </span>
      </div>
      <div className="text-xs font-semibold text-gray-800">
        {data.endMessage || data.label}
      </div>
      <Handle type="target" position={Position.Left} />
    </NodeContainer>
  );
}
