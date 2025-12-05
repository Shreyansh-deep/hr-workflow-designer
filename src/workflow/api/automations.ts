import type { AutomationAction } from '../types';

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  // simulate GET /automations
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_AUTOMATIONS;
}
