"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Chip, Skeleton, Card } from "@heroui/react";
import { JobCard, Job } from "@/components/jobs/JobCard";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: relatedJobs } = useQuery({
    queryKey: ['job-related', id],
    queryFn: async () => {
      const response = await api.get(`/jobs/related/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleApply = () => {
    toast.success("Application started! (Demo)");
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <span className="text-5xl">🔍</span>
          <h1 className="text-3xl font-bold text-danger mt-4 mb-2">Job Not Found</h1>
          <p className="text-slate-400 mb-8">The job you are looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.push('/jobs')} className="w-full bg-primary text-white h-12 rounded-xl font-bold hover:opacity-90 transition-opacity">
            Back to Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/jobs')} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group font-medium text-sm"
      >
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 space-y-6">
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-8 w-2/3 rounded-lg" />
                  <Skeleton className="h-5 w-1/3 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
              <hr className="border-slate-800" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  {job.logoUrl ? (
                    <img 
                      src={job.logoUrl} 
                      alt={`${job.company} Logo`} 
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-800 bg-slate-950"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=6366F1&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center font-black text-3xl text-primary">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">{job.title}</h1>
                    <p className="text-lg font-bold text-primary flex items-center gap-1.5">{job.company}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Chip size="sm" variant="soft" className="bg-purple-950/40 text-purple-300 border border-purple-800/20 font-semibold">{job.category}</Chip>
                  <Chip size="sm" variant="soft" className="bg-blue-950/40 text-blue-300 border border-blue-800/20 font-semibold">{job.type}</Chip>
                </div>
              </div>

              <hr className="border-slate-800/80 my-8" />

              {/* Description */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-primary">📋</span>
                  Role Overview
                </h2>
                <div className="whitespace-pre-wrap text-slate-300 text-base md:text-lg leading-relaxed font-normal">
                  {job.description || "No detailed description provided."}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <>
                  <hr className="border-slate-800/80 my-8" />
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="text-primary">🎯</span>
                      Requirements & Skills
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.requirements.map((req: string, i: number) => (
                        <li key={i} className="flex gap-3 text-slate-300 text-base leading-relaxed">
                          <span className="text-primary mt-1">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary & Actions */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Job Summary</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-6 w-5/6 rounded" />
                <Skeleton className="h-6 w-2/3 rounded" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-primary text-base">📍</div>
                  <div>
                    <p className="text-slate-500 font-medium text-xs">Location</p>
                    <p className="font-semibold text-slate-200">{job.location}</p>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-primary text-base">💰</div>
                  <div>
                    <p className="text-slate-500 font-medium text-xs">Salary</p>
                    <p className="font-semibold text-slate-200">{job.salary}</p>
                  </div>
                </div>

                {/* Job Type */}
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-primary text-base">💼</div>
                  <div>
                    <p className="text-slate-500 font-medium text-xs">Job Type</p>
                    <p className="font-semibold text-slate-200">{job.type}</p>
                  </div>
                </div>

                {/* Posted Date */}
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-primary text-base">📅</div>
                  <div>
                    <p className="text-slate-500 font-medium text-xs">Date Posted</p>
                    <p className="font-semibold text-slate-200">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            <hr className="border-slate-800" />

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleApply} 
                className="w-full bg-primary text-white h-12 rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                Apply Now
              </button>
              <button 
                onClick={() => router.push('/ai-coach')} 
                className="w-full border border-slate-700 bg-slate-800/30 text-slate-200 hover:bg-slate-800 hover:text-white h-12 rounded-xl font-bold transition-all cursor-pointer text-base flex items-center justify-center gap-2"
              >
                <span>✨</span> Prep with AI Coach
              </button>
            </div>
          </div>

          {/* Similar Jobs */}
          {!isLoading && relatedJobs && relatedJobs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight">Similar Positions</h3>
              <div className="grid grid-cols-1 gap-4">
                {relatedJobs.map((relatedJob: Job) => (
                  <JobCard key={relatedJob._id} job={relatedJob} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
