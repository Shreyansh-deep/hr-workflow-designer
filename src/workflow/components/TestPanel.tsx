import { useState } from 'react';
import { useWorkflow } from '../WorkflowProvider';
import { simulateWorkflow } from '../api/simulate';
import type { SimulationResult, WorkflowNode } from '../types';

interface ValidationResult {
  errors: string[];
  warnings: string[];
  errorNodeIds: string[];
}

function validateWorkflow(nodes: WorkflowNode[], edges: any[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const errorNodeIds: string[] = [];

  const startNodes = nodes.filter((n) => n.data.type === 'start');
  const endNodes = nodes.filter((n) => n.data.type === 'end');

  if (startNodes.length === 0) {
    errors.push('Workflow must contain exactly one Start node (none found).');
  } else if (startNodes.length > 1) {
    errors.push('Workflow must contain exactly one Start node (multiple found).');
    startNodes.forEach((n) => errorNodeIds.push(n.id));
  }

  if (endNodes.length === 0) {
    errors.push('Workflow should contain at least one End node.');
  }

  // simple connectivity + incoming edges
  const incoming: Record<string, number> = {};
  nodes.forEach((n) => (incoming[n.id] = 0));
  edges.forEach((e) => {
    if (incoming[e.target] != null) incoming[e.target] += 1;
  });

  nodes.forEach((n) => {
    if (n.data.type === 'start') return;
    if (incoming[n.id] === 0) {
      warnings.push(
        `Node "${n.data.label}" has no incoming connection.`,
      );
    }
  });

  // cycle detection (DFS)
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();
  let hasCycle = false;

  const dfs = (id: string) => {
    if (visiting.has(id)) {
      hasCycle = true;
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    adj[id].forEach((next) => dfs(next));
    visiting.delete(id);
    visited.add(id);
  };

  nodes.forEach((n) => {
    if (!visited.has(n.id)) dfs(n.id);
  });

  if (hasCycle) {
    errors.push('Workflow contains at least one cycle.');
  }

  return { errors, warnings, errorNodeIds };
}

export function TestPanel() {
  const { nodes, edges, toGraph, markErrorNodes, clearNodeErrors } =
    useWorkflow();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const onRunSimulation = async () => {
    setResult(null);
    clearNodeErrors();

    const validation = validateWorkflow(nodes, edges);
    if (validation.errorNodeIds.length > 0) {
      markErrorNodes(validation.errorNodeIds);
    }

    if (validation.errors.length > 0) {
      // turn validation into a failure SimulationResult-like object
      setResult({
        success: false,
        steps: [],
        errors: validation.errors,
        warnings: validation.warnings,
      });
      return;
    }

    setRunning(true);
    try {
      const graph = toGraph();
      const sim = await simulateWorkflow(graph);
      // merge validation warnings with simulation warnings
      sim.warnings = [...validation.warnings, ...(sim.warnings || [])];
      setResult(sim);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex h-[280px] flex-col px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Workflow Test / Sandbox
          </h2>
          <p className="text-[10px] text-gray-400">
            Serializes the graph, validates structure, and sends it to a mock
            /simulate API.
          </p>
        </div>
        <button
          onClick={onRunSimulation}
          disabled={running || nodes.length === 0}
          className={`rounded-md px-3 py-1 text-[11px] font-medium ${
            running || nodes.length === 0
              ? 'cursor-not-allowed bg-gray-200 text-gray-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {running ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-2 text-[11px] scroll-thin">
        {!result && (
          <p className="text-gray-500">
            No simulation run yet. Build a workflow and click &quot;Run
            Simulation&quot;.
          </p>
        )}

        {result && (
          <div className="space-y-2">
            {result.errors.length > 0 && (
              <div>
                <div className="mb-1 font-semibold text-red-600">Errors</div>
                {result.errors.map((err, idx) => (
                  <div key={idx} className="text-red-600">
                    • {err}
                  </div>
                ))}
              </div>
            )}

            {result.warnings.length > 0 && (
              <div>
                <div className="mb-1 font-semibold text-amber-600">
                  Warnings
                </div>
                {result.warnings.map((w, idx) => (
                  <div key={idx} className="text-amber-700">
                    • {w}
                  </div>
                ))}
              </div>
            )}

            {result.steps.length > 0 && (
              <div>
                <div className="mb-1 font-semibold text-gray-700">
                  Execution Log
                </div>
                <ol className="space-y-1">
                  {result.steps.map((step) => (
                    <li key={step.index}>
                      <span className="font-mono text-[10px] text-gray-500">
                        {step.index}.
                      </span>{' '}
                      <span
                        className={
                          step.status === 'error'
                            ? 'text-red-600'
                            : step.status === 'warning'
                            ? 'text-amber-700'
                            : 'text-gray-800'
                        }
                      >
                        {step.message}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {result.steps.length === 0 &&
              result.errors.length === 0 &&
              result.warnings.length === 0 && (
                <p className="text-gray-500">
                  Simulation completed with no steps and no messages.
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
