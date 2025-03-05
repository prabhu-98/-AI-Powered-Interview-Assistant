import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-6 bg-accent text-accent-foreground rounded-lg px-16 py-8">
        <Loader2 className="animate-spin" />
        <p>Loading...</p>
      </div>
    </div>
  )
}

export default Loading
