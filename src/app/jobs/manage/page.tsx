"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
  Skeleton
} from "@heroui/react";
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
        <Button color="primary" as={Link} href="/jobs/add">
          Post New Job
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <Table aria-label="Manage your posted jobs" removeWrapper>
          <TableHeader>
            <TableColumn>JOB TITLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>VIEWS</TableColumn>
            <TableColumn>POSTED DATE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={isLoading ? "Loading jobs..." : "You haven't posted any jobs yet."}
            isLoading={isLoading}
            loadingContent={
              <div className="w-full flex flex-col gap-4 mt-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            }
          >
            {jobs?.map((job: any) => (
              <TableRow key={job._id}>
                <TableCell>
                  <div>
                    <p className="font-bold">{job.title}</p>
                    <p className="text-xs text-muted">{job.location} • {job.type}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={job.status === 'open' ? 'success' : 'default'} 
                    size="sm" 
                    variant="dot"
                  >
                    {job.status === 'open' ? 'Active' : 'Closed'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>👀</span>
                    <span className="font-semibold">{job.viewCount || 0}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Job actions">
                        <DropdownItem as={Link} href={`/jobs/${job._id}`}>
                          View Listing
                        </DropdownItem>
                        <DropdownItem 
                          onPress={() => statusMutation.mutate({ 
                            id: job._id, 
                            status: job.status === 'open' ? 'closed' : 'open' 
                          })}
                        >
                          Mark as {job.status === 'open' ? 'Closed' : 'Active'}
                        </DropdownItem>
                        <DropdownItem 
                          className="text-danger" 
                          color="danger"
                          onPress={() => {
                            if (window.confirm("Are you sure you want to delete this job?")) {
                              deleteMutation.mutate(job._id);
                            }
                          }}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
