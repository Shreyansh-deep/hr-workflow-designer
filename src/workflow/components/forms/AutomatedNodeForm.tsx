import { useEffect, useState } from 'react';
import type { AutomatedNodeData, AutomationAction } from '../../types';
import { getAutomations } from '../../api/automations';

interface Props {
  data: AutomatedNodeData;
  onChange: (patch: Partial<AutomatedNodeData>) => void;
}

export function AutomatedNodeForm({ data, onChange }: Props) {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAutomations()
      .then((res) => setActions(res))
      .finally(() => setLoading(false));
  }, []);

  const selectedAction = actions.find((a) => a.id === data.actionId);

  const handleParamChange = (key: string, value: string) => {
    onChange({
      params: {
        ...data.params,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-2 border-t border-gray-200 pt-2">
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-600">
          Action
        </label>
        <select
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={data.actionId || ''}
          onChange={(e) =>
            onChange({
              actionId: e.target.value,
              params: {}, // reset params when action changes
            })
          }
        >
          <option value="">{loading ? 'Loading...' : 'Select action'}</option>
          {actions.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {selectedAction && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-semibold text-gray-700">
            Action parameters
          </h3>
          {selectedAction.params.length === 0 && (
            <p className="text-[11px] text-gray-400">
              This action does not require parameters.
            </p>
          )}
          {selectedAction.params.map((param) => (
            <div key={param} className="space-y-1">
              <label className="block text-[11px] font-medium text-gray-600">
                {param}
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                value={data.params?.[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter value for "${param}"`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
