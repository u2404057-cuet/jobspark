"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input, Button, Select, SelectItem, Pagination } from "@heroui/react";
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
      <div className="bg-surface border border-border rounded-xl p-4 mb-8 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              placeholder="Search by job title, skill, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startContent={<span className="text-muted">🔍</span>}
              variant="bordered"
              size="lg"
            />
          </div>
          
          <Select 
            placeholder="Category" 
            variant="bordered" 
            size="lg"
            className="md:w-48"
            selectedKeys={category ? [category] : []}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </Select>
          
          <Select 
            placeholder="Job Type" 
            variant="bordered" 
            size="lg"
            className="md:w-48"
            selectedKeys={type ? [type] : []}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            {jobTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </Select>
          
          <Button type="submit" color="primary" size="lg" className="md:w-32">
            Search
          </Button>
        </form>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isLoading ? "Loading..." : `${data?.total || 0} Jobs Found`}
        </h2>
        
        {(debouncedSearch || category || type) && (
          <Button 
            variant="light" 
            color="danger" 
            onPress={() => {
              setSearch("");
              setDebouncedSearch("");
              setCategory("");
              setType("");
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {error ? (
        <div className="text-center py-20 text-danger">
          <p>Failed to load jobs. Please try again later.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map(i => <JobCardSkeleton key={i} />)}
        </div>
      ) : data?.jobs?.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border rounded-xl">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
          <p className="text-muted">Try adjusting your search criteria or clear filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {data?.jobs.map((job: Job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          
          {data?.total > limit && (
            <div className="flex justify-center mt-10">
              <Pagination
                total={Math.ceil(data.total / limit)}
                page={page}
                onChange={setPage}
                color="primary"
                size="lg"
                showControls
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
