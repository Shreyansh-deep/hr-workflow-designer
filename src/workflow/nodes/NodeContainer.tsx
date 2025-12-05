import type { ReactNode } from 'react';

export function NodeContainer({
  children,
  type,
  hasError,
}: {
  children: ReactNode;
  type: string;
  hasError?: boolean;
}) {
  const base =
    'rounded-lg border bg-white px-3 py-2 text-xs shadow-sm min-w-[160px]';
  const borderColor =
    type === 'start'
      ? 'border-blue-400'
      : type === 'task'
      ? 'border-emerald-400'
      : type === 'approval'
      ? 'border-amber-400'
      : type === 'automated'
      ? 'border-sky-400'
      : 'border-rose-400';

  const errorClass = hasError ? 'node-error' : '';

  return (
    <div className={`${base} ${borderColor} ${errorClass}`}>
      {children}
    </div>
  );
}
