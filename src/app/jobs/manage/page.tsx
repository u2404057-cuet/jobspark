"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@heroui/react";
import toast from "react-hot-toast";

export default function ManageJobsPage() {
  const queryClient = useQueryClient();
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const response = await api.get('/api/jobs/my-jobs');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Job deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete job");
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/api/jobs/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Job status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <p className="text-muted mt-2">View, edit, and manage your job listings.</p>
        </div>
        <a href="/jobs/add" className="bg-primary text-white h-10 px-4 rounded-lg font-medium flex items-center justify-center hover:opacity-90 transition-opacity">
          Post New Job
        </a>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-slate-800/80 last:border-0">
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-5 w-1/3 rounded-lg bg-slate-850" />
                  <Skeleton className="h-3.5 w-1/4 rounded-lg bg-slate-850" />
                </div>
                <div className="w-24">
                  <Skeleton className="h-6 w-16 rounded-full bg-slate-850" />
                </div>
                <div className="w-16">
                  <Skeleton className="h-5 w-10 rounded-lg bg-slate-850" />
                </div>
                <div className="flex gap-2 justify-end w-48">
                  <Skeleton className="h-8 w-14 rounded-lg bg-slate-850" />
                  <Skeleton className="h-8 w-16 rounded-lg bg-slate-850" />
                  <Skeleton className="h-8 w-16 rounded-lg bg-slate-850" />
                </div>
              </div>
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-8 text-center text-muted">You haven't posted any jobs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-default-50">
                  <th className="p-4 font-semibold text-sm">JOB TITLE</th>
                  <th className="p-4 font-semibold text-sm">STATUS</th>
                  <th className="p-4 font-semibold text-sm">VIEWS</th>
                  <th className="p-4 font-semibold text-sm text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job: any) => (
                  <tr key={job._id} className="border-b border-border last:border-0 hover:bg-default-50/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold">{job.title}</p>
                        <p className="text-xs text-muted">{job.location} • {job.type}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'open' ? 'bg-success/20 text-success-600' : 'bg-default-200 text-default-600'
                      }`}>
                        {job.status === 'open' ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>👀</span>
                        <span className="font-semibold">{job.viewCount || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2.5">
                        <a 
                          href={`/jobs/${job._id}`} 
                          className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all hover:bg-primary/20 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <span>👁️</span> View
                        </a>
                        <button 
                          onClick={() => statusMutation.mutate({ 
                            id: job._id, 
                            status: job.status === 'open' ? 'closed' : 'open' 
                          })}
                          className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700/60 rounded-xl text-xs font-bold transition-all hover:bg-slate-700 hover:text-white flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          {job.status === 'open' ? (
                            <>
                              <span>🔒</span> Close
                            </>
                          ) : (
                            <>
                              <span>🔓</span> Activate
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => setDeleteJobId(job._id)}
                          className="px-3 py-1.5 bg-danger/10 text-danger border border-danger/20 rounded-xl text-xs font-bold transition-all hover:bg-danger/20 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {deleteJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl transition-all transform duration-300">
            <h3 className="text-xl font-bold text-white mb-2">Delete Job Listing?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete this job listing? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteJobId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteMutation.mutate(deleteJobId);
                  setDeleteJobId(null);
                }}
                className="px-4 py-2 bg-danger text-white rounded-xl text-sm font-semibold hover:bg-danger/90 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-danger/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
