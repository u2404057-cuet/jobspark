"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@heroui/react";
import toast from "react-hot-toast";

export default function ManageJobsPage() {
  const queryClient = useQueryClient();

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
          <div className="p-8 text-center text-muted">Loading jobs...</div>
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
                  <th className="p-4 font-semibold text-sm">POSTED DATE</th>
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
                    <td className="p-4 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <a href={`/jobs/${job._id}`} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium">
                          View
                        </a>
                        <button 
                          onClick={() => statusMutation.mutate({ 
                            id: job._id, 
                            status: job.status === 'open' ? 'closed' : 'open' 
                          })}
                          className="p-2 text-foreground hover:bg-default-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          {job.status === 'open' ? 'Close' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this job?")) {
                              deleteMutation.mutate(job._id);
                            }
                          }}
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors text-sm font-medium"
                        >
                          Delete
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
    </div>
  );
}
