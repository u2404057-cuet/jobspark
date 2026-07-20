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
      const response = await api.post('/api/ai/generate-description', {
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
      
      const response = await api.post('/api/jobs', payload);
      toast.success("Job posted successfully!");
      router.push(`/jobs/${response.data._id}`);
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="w-full max-w-3xl mx-auto p-8 bg-surface border border-border rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
        
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Job Title</label>
              <input
                required
                className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                name="title"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">Company Name</label>
                <input
                  required
                  className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                  name="company"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">Location</label>
                <input
                  required
                  className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                  name="location"
                  placeholder="e.g. Remote, NY"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">Salary Range</label>
                <input
                  className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                  name="salary"
                  placeholder="e.g. $100k - $120k"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Job Type</label>
                <select 
                  required
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                >
                  {jobTypes.map((t) => (
                    <option key={t} value={t} className="bg-background text-foreground">{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Category</label>
                <select 
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-background text-foreground">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Logo URL</label>
              <input
                className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl px-3 h-12 outline-none transition-colors"
                name="logoUrl"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Requirements (One per line)</label>
              <textarea
                required
                name="requirements"
                placeholder="- 5+ years React experience\n- Strong TypeScript skills\n- Experience with Next.js"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl p-3 outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium">Job Description</label>
                <textarea
                  required
                  name="description"
                  placeholder="Describe the role in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full bg-transparent border-2 border-default-200 hover:border-default-400 focus:border-primary rounded-xl p-3 outline-none transition-colors"
                />
              </div>
              <button 
                type="button"
                className="absolute top-8 right-2 z-10 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-primary/20 transition-colors"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
              >
                {!isGenerating && <span>✨</span>}
                {isGenerating ? "Writing..." : "AI Write"}
              </button>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button type="button" className="px-6 py-2 bg-default-100 rounded-xl font-medium hover:bg-default-200 transition-colors" onClick={() => router.back()}>
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="h-12 bg-primary text-white rounded-xl px-6 font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
