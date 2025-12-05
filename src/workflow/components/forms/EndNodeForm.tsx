import type { EndNodeData } from '../../types';

interface Props {
  data: EndNodeData;
  onChange: (patch: Partial<EndNodeData>) => void;
}

export function EndNodeForm({ data, onChange }: Props) {
  return (
    <div className="space-y-2 border-t border-gray-200 pt-2">
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-600">
          End message
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={data.endMessage || ''}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="Displayed when workflow completes"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="summaryEnabled"
          type="checkbox"
          className="h-3 w-3 rounded border-gray-300"
          checked={data.summaryEnabled}
          onChange={(e) => onChange({ summaryEnabled: e.target.checked })}
        />
        <label
          htmlFor="summaryEnabled"
          className="text-[11px] text-gray-600 select-none"
        >
          Include summary output
        </label>
      </div>
    </div>
  );
}
