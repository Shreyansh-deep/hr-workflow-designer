import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { ApprovalNodeData } from '../types';
import { NodeContainer } from './NodeContainer';

export function ApprovalNode({ data }: NodeProps<ApprovalNodeData>) {
  return (
    <NodeContainer type="approval" hasError={data.hasError}>
      <div className="mb-1 flex items-center justify-between">
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          Approval
        </span>
      </div>
      <div className="text-xs font-semibold text-gray-800">{data.label}</div>
      <div className="mt-0.5 text-[10px] text-gray-500">
        Role: {data.approverRole || '—'}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
}
