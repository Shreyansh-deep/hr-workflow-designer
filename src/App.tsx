
import { WorkflowProvider } from './workflow/WorkflowProvider';
import { WorkflowPage } from './workflow/components/WorkFlowPage';


function App() {
  return (
    <WorkflowProvider>
      <WorkflowPage />
    </WorkflowProvider>
  )
}

export default App
