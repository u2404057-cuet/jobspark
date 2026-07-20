import { Link } from "@heroui/react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/40 py-12 mt-auto text-slate-400">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-primary text-2xl">⚡</span>
            <p className="font-bold text-xl tracking-tight text-white">JobSpark <span className="text-primary">AI</span></p>
          </div>
          <p className="text-sm">
            Find your dream job faster with the power of Artificial Intelligence.
          </p>
          <div className="text-xs space-y-1.5 pt-2">
            <p className="flex items-center gap-2">
              <span>📧</span> support@jobspark.ai
            </p>
            <p className="flex items-center gap-2">
              <span>📞</span> +1 (555) 019-2834
            </p>
            <p className="flex items-center gap-2">
              <span>📍</span> 100 Pine St, San Francisco, CA
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/jobs" className="text-slate-400 hover:text-primary transition-colors text-sm">Browse Jobs</Link></li>
            <li><Link href="/jobs/add" className="text-slate-400 hover:text-primary transition-colors text-sm">Post a Job</Link></li>
            <li><Link href="/ai-coach" className="text-slate-400 hover:text-primary transition-colors text-sm">AI Career Coach</Link></li>
            <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-sm">Pricing Plans</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-sm">About Us</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-primary transition-colors text-sm">Contact Support</Link></li>
            <li><Link href="/blog" className="text-slate-400 hover:text-primary transition-colors text-sm">Our Blog</Link></li>
            <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors text-sm">Careers</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="text-slate-400 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-400 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-primary transition-colors text-sm">Cookie Settings</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs">
          © {new Date().getFullYear()} JobSpark AI. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm font-semibold">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm font-semibold">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm font-semibold">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
