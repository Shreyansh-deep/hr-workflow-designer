import type { TaskNodeData } from '../../types';

interface Props {
  data: TaskNodeData;
  onChange: (patch: Partial<TaskNodeData>) => void;
}

export function TaskNodeForm({ data, onChange }: Props) {
  const customEntries = Object.entries(data.customFields || {});

  const updateCustom = (key: string, value: string) => {
    onChange({
      customFields: {
        ...data.customFields,
        [key]: value,
      },
    });
  };

  const addCustom = () => {
    const newKey = `field_${customEntries.length + 1}`;
    updateCustom(newKey, '');
  };

  const removeCustom = (key: string) => {
    const copy = { ...data.customFields };
    delete copy[key];
    onChange({ customFields: copy });
  };

  return (
    <div className="space-y-2 border-t border-gray-200 pt-2">
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-600">
          Description
        </label>
        <textarea
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the human task"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-600">
          Assignee
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={data.assignee || ''}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="Name or role (string)"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-600">
          Due date
        </label>
        <input
          type="date"
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={data.dueDate || ''}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-gray-700">
            Custom fields
          </h3>
          <button
            type="button"
            onClick={addCustom}
            className="rounded-md border border-dashed border-gray-300 px-2 py-0.5 text-[11px] text-gray-600 hover:bg-gray-50"
          >
            + Add field
          </button>
        </div>

        {customEntries.length === 0 && (
          <p className="text-[11px] text-gray-400">
            Add optional key-value fields for this task.
          </p>
        )}

        <div className="space-y-1">
          {customEntries.map(([key, value], index) => (
            <div key={index} className="flex gap-1">
              <input
                className="w-1/2 rounded-md border border-gray-300 px-2 py-1 text-[11px]"
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const copy = { ...data.customFields };
                  delete copy[key];
                  copy[newKey] = value;
                  onChange({ customFields: copy });
                }}
                placeholder="Key"
              />
              <input
                className="w-1/2 rounded-md border border-gray-300 px-2 py-1 text-[11px]"
                value={value}
                onChange={(e) => updateCustom(key, e.target.value)}
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => removeCustom(key)}
                className="rounded-md border border-gray-200 px-2 text-[11px] text-gray-500 hover:bg-gray-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
