import { AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { motion } from "framer-motion"

interface ErrorStateProps {
  title?: string
  message?: string
  retryAction?: () => void
  actionLabel?: string
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "We encountered an unexpected error while processing your request.", 
  retryAction, 
  actionLabel = "Try Again" 
}: ErrorStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-destructive/10 rounded-2xl border border-destructive/20 min-h-[300px]"
    >
      <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[400px]">
        {message}
      </p>
      {retryAction && (
        <Button variant="destructive" onClick={retryAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
