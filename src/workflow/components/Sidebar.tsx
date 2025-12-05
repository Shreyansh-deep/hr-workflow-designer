import type { NodeType } from '../types';
import { useWorkflow } from '../WorkflowProvider';

const nodeDefinitions: { type: NodeType; label: string; description: string }[] =
  [
    { type: 'start', label: 'Start', description: 'Workflow entry point' },
    { type: 'task', label: 'Task', description: 'Human task step' },
    { type: 'approval', label: 'Approval', description: 'Manager / HR approval' },
    {
      type: 'automated',
      label: 'Automated',
      description: 'System-triggered action',
    },
    { type: 'end', label: 'End', description: 'Workflow completion' },
  ];

export function Sidebar() {
  const { nodes } = useWorkflow();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType,
  ) => {
    event.dataTransfer.setData('application/hr-node-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const hasStartNode = nodes.some((n) => n.data.type === 'start');

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-gray-200 px-4 py-3">
        <h1 className="text-sm font-semibold text-gray-800">
          HR Workflow Designer
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Drag node types onto the canvas to define onboarding, leave approval,
          and other HR workflows.
        </p>
      </header>

      <div className="flex-1 overflow-auto px-3 py-3 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Node Library
        </h2>
        <div className="space-y-2">
          {nodeDefinitions.map((def) => {
            const disabled = def.type === 'start' && hasStartNode;
            return (
              <div
                key={def.type}
                draggable={!disabled}
                onDragStart={(e) => !disabled && onDragStart(e, def.type)}
                className={`rounded-md border px-3 py-2 text-xs bg-white shadow-sm cursor-move ${
                  disabled ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    {def.label}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {def.type.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-500">
                  {def.description}
                </p>
                {def.type === 'start' && hasStartNode && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Only one Start node allowed.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="border-t border-gray-200 px-3 py-2 text-[10px] text-gray-400">
        Tip: Connect nodes with edges, then use the panel on the right to edit
        node configuration and simulate the workflow.
      </footer>
    </div>
  );
}
