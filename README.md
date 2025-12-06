# HR Workflow Designer (React + React Flow)

A prototype HR Workflow Designer enabling admins to visually create and test HR workflows such as onboarding, approvals, and automated actions.

---

## Architecture

**Tech Stack**
- React + TypeScript
- React Flow (canvas, drag & drop, edges)
- Tailwind CSS (UI styling)
- Context API for workflow state

**Key Modules**
- `workflow/types.ts`  
  Strongly typed workflow model for node types, actions, and simulation
- `workflow/WorkflowProvider.tsx`  
  Central state for nodes, edges, and selected node
- `workflow/components/WorkflowCanvas.tsx`  
  React Flow canvas with drag & drop + connection logic
- `workflow/components/Sidebar.tsx`  
  Node library + drag source
- `workflow/components/NodeConfigPanel.tsx` + `forms/*`  
  Configurable forms for each node type
- `workflow/components/TestPanel.tsx`  
  Validation + mock simulation runner
- `workflow/api/*`  
  Mock `GET /automations` + `POST /simulate` endpoints

**Data Flow**
Canvas → Node Selection → Config Panel Updates → Store  
Test Panel → Validate Graph → Simulate → Show Log

---

## How to Run

```bash
npm install
npm run dev
```


## Design Decisions

React Flow for Graph UI
Instead of custom canvas → faster development + reliable interactions

Modular Structure
Canvas, forms, sandbox, and API mock kept isolated for scalability

Type Safety First
All workflow nodes strictly typed for correctness and future growth

Mock API Abstraction
Enables simple replacement with real backend later

Validation Before Simulation
Ensures structural correctness (Start node, End node, no cycles, etc.)

## What Was Completed

✔ All 5 node types: Start, Task, Approval, Automated, End
✔ Drag-and-drop workflow building
✔ Connection editing with edges
✔ Type-specific dynamic configuration forms
✔ GET /automations mock API
✔ POST /simulate mock API
✔ Workflow validation (Start/End, cycles, missing edges)
✔ Sandbox with simulation execution log
✔ Visual error feedback on nodes
✔ Clean, scalable folder structure with Tailwind UI

## What I Would Add With More Time

• Export/Import workflow JSON
• Undo/Redo history
• Advanced validation + branch logic
• Node templates & library of workflow examples
• Real backend with persistence
• Auto-layout and alignment helpers
• Timeline-based or step-through workflow execution
