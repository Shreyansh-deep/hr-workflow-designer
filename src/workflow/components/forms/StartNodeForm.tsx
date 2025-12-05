import type { StartNodeData } from '../../types';

interface Props {
  data: StartNodeData;
  onChange: (patch: Partial<StartNodeData>) => void;
}

export function StartNodeForm({ data, onChange }: Props) {
  const metadataEntries = Object.entries(data.metadata || {});

  const updateMeta = (key: string, value: string) => {
    onChange({
      metadata: {
        ...data.metadata,
        [key]: value,
      },
    });
  };

  const addMeta = () => {
    const newKey = `key_${metadataEntries.length + 1}`;
    updateMeta(newKey, '');
  };

  const removeMeta = (key: string) => {
    const copy = { ...data.metadata };
    delete copy[key];
    onChange({ metadata: copy });
  };

  return (
    <div className="space-y-2 border-t border-gray-200 pt-2">
      <h3 className="text-[11px] font-semibold text-gray-700">Metadata</h3>
      {metadataEntries.length === 0 && (
        <p className="text-[11px] text-gray-400">
          No metadata added. Use &quot;Add field&quot; to add optional
          key-value pairs.
        </p>
      )}
      <div className="space-y-2">
        {metadataEntries.map(([key, value]) => (
          <div key={key} className="flex gap-1">
            <input
              className="w-1/2 rounded-md border border-gray-300 px-2 py-1 text-[11px]"
              value={key}
              onChange={(e) => {
                const newKey = e.target.value;
                const copy = { ...data.metadata };
                delete copy[key];
                copy[newKey] = value;
                onChange({ metadata: copy });
              }}
              placeholder="Key"
            />
            <input
              className="w-1/2 rounded-md border border-gray-300 px-2 py-1 text-[11px]"
              value={value}
              onChange={(e) => updateMeta(key, e.target.value)}
              placeholder="Value"
            />
            <button
              type="button"
              onClick={() => removeMeta(key)}
              className="rounded-md border border-gray-200 px-2 text-[11px] text-gray-500 hover:bg-gray-50"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addMeta}
        className="rounded-md border border-dashed border-gray-300 px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50"
      >
        + Add field
      </button>
    </div>
  );
}
