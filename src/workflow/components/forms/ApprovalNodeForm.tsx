import type { ApprovalNodeData } from '../../types';

interface Props {
  data: ApprovalNodeData;
  onChange: (patch: Partial<ApprovalNodeData>) => void;
}

export function ApprovalNodeForm({ data, onChange }: Props) {
  return (
    <div className="space-y-2 border-t border-gray-200 pt-2">
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-600">
          Approver role
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={data.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value })}
          placeholder="e.g. Manager, HRBP, Director"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-600">
          Auto-approve threshold
        </label>
        <input
          type="number"
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={data.autoApproveThreshold ?? ''}
          onChange={(e) =>
            onChange({
              autoApproveThreshold:
                e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
          placeholder="Number value (optional)"
        />
        <p className="text-[10px] text-gray-400">
          Example: auto-approve requests under a certain amount.
        </p>
      </div>
    </div>
  );
}
