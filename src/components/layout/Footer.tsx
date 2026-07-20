import { Link } from "@heroui/react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface/50 py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary text-2xl">⚡</span>
            <p className="font-bold text-xl tracking-tight">JobSpark <span className="text-primary">AI</span></p>
          </div>
          <p className="text-muted text-sm">
            Find your dream job faster with the power of Artificial Intelligence.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/jobs">Browse Jobs</Link></li>
            <li><Link href="/jobs/add">Post a Job</Link></li>
            <li><Link href="/ai-coach">AI Career Coach</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/careers">Careers</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} JobSpark AI. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          {/* Social icons can go here */}
        </div>
      </div>
    </footer>
  );
}
