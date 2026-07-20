"use client";

import toast from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
          <p className="text-muted text-lg mb-8">
            Have questions about JobSpark AI? Need help with your account? Our team is here to support your career journey.
          </p>
          
          <div className="space-y-6 text-muted">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📧</span>
              <span>support@jobspark.ai</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">📍</span>
              <span>123 Career Blvd, Tech City, CA 94000</span>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-2xl mx-auto p-8 bg-surface border border-border rounded-2xl shadow-xl mt-12">
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">First Name</label>
                <input required className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">Last Name</label>
                <input required className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Email</label>
              <input required type="email" className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors" />
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Subject</label>
              <input required className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors" />
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Message</label>
              <textarea required rows={4} className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl p-3 outline-none transition-colors"></textarea>
            </div>
            
            <button type="submit" className="mt-2 w-full h-12 bg-primary text-white rounded-xl font-medium hover:opacity-90">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
