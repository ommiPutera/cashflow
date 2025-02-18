export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <div className="text-danger-500 text-xs">{children}</div>;
}
