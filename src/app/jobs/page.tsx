"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { JobCard, JobCardSkeleton, Job } from "@/components/jobs/JobCard";

export default function BrowseJobsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  // Debounced search for API call
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', debouncedSearch, category, type, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (category) params.append('category', category);
      if (type) params.append('type', type);

      const response = await api.get(`/api/jobs?${params.toString()}`);
      return response.data;
    },
  });

  const categories = [
    "Software Engineering", "Design & UX", "Marketing", "Data Science",
    "Product Management", "Sales", "Finance", "Customer Success"
  ];

  const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Browse Jobs</h1>
        <p className="text-muted text-lg">
          Find your next career opportunity from our curated list of top companies.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 mb-8 shadow-2xl">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by job title, company, or keywords..."
              className="w-full bg-slate-950/60 text-white placeholder:text-slate-400/70 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-12 pr-4 h-12 outline-none transition-all duration-200 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          <select 
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="md:w-48 bg-slate-950/60 text-slate-200 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium cursor-pointer"
          >
            <option value="" className="bg-slate-950 text-white font-medium">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-950 text-white font-medium">{c}</option>
            ))}
          </select>
          
          <select 
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="md:w-48 bg-slate-950/60 text-slate-200 border border-slate-800 hover:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 h-12 outline-none transition-all duration-200 font-medium cursor-pointer"
          >
            <option value="" className="bg-slate-950 text-white font-medium">All Types</option>
            {jobTypes.map((t) => (
              <option key={t} value={t} className="bg-slate-950 text-white font-medium">{t}</option>
            ))}
          </select>
          
          <button 
            type="submit" 
            className="md:w-32 bg-primary text-white rounded-xl font-bold h-12 hover:opacity-90 active:scale-[0.99] transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isLoading ? "Loading..." : `${data?.total || 0} Jobs Found`}
        </h2>
        
        {(debouncedSearch || category || type) && (
          <button 
            type="button"
            className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={() => {
              setSearch("");
              setDebouncedSearch("");
              setCategory("");
              setType("");
              setPage(1);
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {error ? (
        <div className="text-center py-20 text-danger">
          <p>Failed to load jobs. Please try again later.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <JobCardSkeleton key={i} />)}
        </div>
      ) : data?.jobs?.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border rounded-xl">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
          <p className="text-muted">Try adjusting your search criteria or clear filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {data?.jobs.map((job: Job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          
          {data?.total > limit && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-10 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-300 cursor-pointer flex items-center justify-center gap-1 text-sm shadow-md"
              >
                ← Prev
              </button>
              
              {Array.from({ length: Math.ceil(data.total / limit) }).map((_, idx) => {
                const pNum = idx + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`h-10 w-10 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-md ${
                      page === pNum
                        ? 'bg-primary text-white border border-primary shadow-primary/20 scale-[1.05]'
                        : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button 
                onClick={() => setPage(p => Math.min(Math.ceil(data.total / limit), p + 1))}
                disabled={page >= Math.ceil(data.total / limit)}
                className="h-10 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-300 cursor-pointer flex items-center justify-center gap-1 text-sm shadow-md"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
