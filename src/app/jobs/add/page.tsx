"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PostJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full Time",
    category: "Software Engineering",
    salary: "",
    requirements: "",
    description: "",
    logoUrl: "",
  });

  const categories = [
    "Software Engineering", "Design & UX", "Marketing", "Data Science",
    "Product Management", "Sales", "Finance", "Customer Success"
  ];

  const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance"];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category || !formData.requirements) {
      toast.error("Please fill in Title, Category, and Requirements first.");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("AI is writing the description...");
    
    try {
      const requirementsList = formData.requirements.split('\n').filter(r => r.trim());
      const response = await api.post('/ai/generate-description', {
        title: formData.title,
        category: formData.category,
        requirements: requirementsList
      });
      
      setFormData(prev => ({ ...prev, description: response.data.description }));
      toast.success("Description generated!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to generate description", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim())
      };
      
      const response = await api.post('/jobs', payload);
      toast.success("Job posted successfully!");
      router.push(`/jobs/${response.data._id}`);
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="w-full p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl space-y-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Post a New Job</h1>
        
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-300">Job Title</label>
              <input
                required
                className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                name="title"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-300">Company Name</label>
                <input
                  required
                  className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                  name="company"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-300">Location</label>
                <input
                  required
                  className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                  name="location"
                  placeholder="e.g. Remote, NY"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-300">Salary Range</label>
                <input
                  className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                  name="salary"
                  placeholder="e.g. $100k - $120k"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">Job Type</label>
                <select 
                  required
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 text-white border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                >
                  {jobTypes.map((t) => (
                    <option key={t} value={t} className="bg-slate-950 text-white">{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">Category</label>
                <select 
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 text-white border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-slate-950 text-white">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-300">Logo URL</label>
              <input
                className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium"
                name="logoUrl"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-300">Requirements (One per line)</label>
              <textarea
                required
                name="requirements"
                placeholder="- 5+ years React experience&#10;- Strong TypeScript skills&#10;- Experience with Next.js"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 outline-none transition-all duration-200 font-medium resize-y"
              />
            </div>

            <div className="relative">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-300">Job Description</label>
                <textarea
                  required
                  name="description"
                  placeholder="Describe the role in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 outline-none transition-all duration-200 font-medium resize-y"
                />
              </div>
              <button 
                type="button"
                className="absolute top-9 right-3 z-10 bg-primary/20 text-white hover:bg-primary/30 px-3.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-primary/30 shadow-md shadow-primary/10 disabled:opacity-55"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>✨</span>
                )}
                {isGenerating ? "Writing..." : "AI Write"}
              </button>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                className="px-6 h-12 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl font-bold transition-colors cursor-pointer text-slate-300" 
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="h-12 bg-primary text-white rounded-xl px-6 font-bold hover:opacity-90 active:scale-[0.99] transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
