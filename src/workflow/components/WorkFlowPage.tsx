import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './Sidebar';
import { WorkflowCanvas } from './WorkFlowCanvas';
import { NodeConfigPanel } from './NodeConfigPanel';
import { TestPanel } from './TestPanel';

export function WorkflowPage() {
  return (
    <div className="app-layout">
      <ReactFlowProvider>
        <aside className="app-sidebar flex flex-col">
          <Sidebar />
        </aside>

        <main className="app-main">
          <WorkflowCanvas />
        </main>

        <aside className="app-right-panel flex flex-col">
          <NodeConfigPanel />
          <div className="border-t border-gray-200" />
          <TestPanel />
        </aside>
      </ReactFlowProvider>
    </div>
  );
}
