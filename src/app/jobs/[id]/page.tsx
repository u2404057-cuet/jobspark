"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Chip, Skeleton } from "@heroui/react";
import { JobCard, Job } from "@/components/jobs/JobCard";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await api.get(`/api/jobs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: relatedJobs } = useQuery({
    queryKey: ['job-related', id],
    queryFn: async () => {
      const response = await api.get(`/api/jobs/related/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleApply = () => {
    toast.success("Application started! (Demo)");
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-danger mb-4">Job Not Found</h1>
        <p className="text-muted mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => router.push('/jobs')} className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:opacity-90">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center font-bold text-3xl text-primary">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>
                  <p className="text-xl text-muted">{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <Chip variant="soft" >{job.category}</Chip>
                <Chip variant="soft" >{job.type}</Chip>
                <Chip variant="soft" >{job.location}</Chip>
                <Chip variant="soft">{job.salary}</Chip>
                <Chip variant="soft" >
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </Chip>
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                {/* Normally we'd use dangerouslySetInnerHTML for markdown, but assuming plain text for now with newlines */}
                <div className="whitespace-pre-wrap text-muted text-lg leading-relaxed">
                  {job.description || "No detailed description provided."}
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted text-lg">
                  {job.requirements?.map((req: string, i: number) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 lg:sticky lg:top-24 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-3">Ready to Apply?</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Make sure your resume is up to date and tailored to this position.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleApply} 
                className="w-full bg-primary text-white h-12 rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-primary/10"
              >
                Apply Now
              </button>
              <button 
                onClick={() => router.push('/ai-coach')} 
                className="w-full border border-slate-700 bg-slate-800/40 text-slate-200 hover:bg-slate-800 hover:text-white h-12 rounded-xl font-semibold transition-colors cursor-pointer text-base"
              >
                Prep with AI Coach
              </button>
            </div>
          </div>

          {!isLoading && relatedJobs && relatedJobs.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Similar Jobs</h3>
              <div className="flex flex-col gap-4">
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
