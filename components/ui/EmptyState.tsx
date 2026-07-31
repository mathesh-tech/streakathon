import { FileQuestion, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/20 rounded-2xl bg-white/5">
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function ErrorState({ title, description, retry }: { title: string, description: string, retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 rounded-2xl bg-destructive/5">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-xl font-bold text-destructive mb-2">{title}</h3>
      <p className="text-destructive/80 max-w-sm mb-6">{description}</p>
      {retry && (
        <button onClick={retry} className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-bold">
          Try Again
        </button>
      )}
    </div>
  );
}
