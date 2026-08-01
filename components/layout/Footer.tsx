import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-black/10 bg-background/50 py-12 md:py-16">
      <div className="container max-w-screen-2xl flex flex-col md:flex-row justify-between gap-8 md:gap-12">
        <div className="flex flex-col space-y-4 md:w-1/3">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tighter">
              STREAK<span className="text-primary">ATHON</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            A semester-long hackathon management ecosystem for the Information Technology Department of Sona College of Technology.
          </p>
        </div>
        
        <div className="flex flex-col md:w-1/3 text-left md:text-center">
          <h3 className="font-semibold text-foreground mb-4">Department Info</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>IT Department</li>
            <li>Sona College of Technology</li>
            <li>Email: it@sonatech.ac.in</li>
          </ul>
        </div>

        <div className="flex flex-col md:w-1/3 text-left md:text-right">
          <h3 className="font-semibold text-foreground mb-4">Developed & Managed By</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <strong>Hackathon Ambassador:</strong><br/>
              Vijayaragavan R<br/>
              <a href="mailto:vijayaragavan.24it@sonatech.ac.in" className="hover:text-primary transition-colors text-xs">vijayaragavan.24it@sonatech.ac.in</a>
            </li>
            <li>
              <strong>Developers:</strong><br/>
              Siva Mathesh M<br/>
              <a href="mailto:sivamathesh.24it@sonatech.ac.in" className="hover:text-primary transition-colors text-xs">sivamathesh.24it@sonatech.ac.in</a><br/>
              Vijay Sharma<br/>
              <a href="mailto:vijaysharma.24it@sonatech.ac.in" className="hover:text-primary transition-colors text-xs">vijaysharma.24it@sonatech.ac.in</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container max-w-screen-2xl mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} STREAKATHON. All rights reserved.</p>
        <p className="mt-4 md:mt-0">Designed & Built by IT Students. Version 1.0.0</p>
      </div>
    </footer>
  )
}
