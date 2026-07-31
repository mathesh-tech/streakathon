import Link from 'next/link'
import { Search, Bell, Menu, User } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tighter sm:text-2xl">
              STREAK<span className="text-primary">ATHON</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/events/upcoming" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Upcoming Events
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Leaderboard
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <Search className="h-4 w-4 text-foreground/80" />
          </button>
          <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <Bell className="h-4 w-4 text-foreground/80" />
          </button>
          <Link
            href="/auth/login"
            className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Login
          </Link>
          <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <Menu className="h-5 w-5 text-foreground/80" />
          </button>
        </div>
      </div>
    </header>
  )
}
