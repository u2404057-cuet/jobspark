import { Card, CardBody, Chip, Button, Link } from "@heroui/react";

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  requirements: string[];
  status: string;
  createdAt: string;
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="bg-surface border border-border h-full flex flex-col">
      <CardBody className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-xl text-primary">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <Chip size="sm" color={job.type === 'Full Time' ? 'success' : 'secondary'} variant="flat">
            {job.type}
          </Chip>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{job.title}</h3>
        <p className="text-muted mb-4 text-sm line-clamp-1">{job.company} • {job.location}</p>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          <Chip size="sm" variant="flat">{job.category}</Chip>
          {job.requirements?.slice(0, 2).map((req, i) => (
            <Chip key={i} size="sm" variant="flat">{req}</Chip>
          ))}
          {job.requirements?.length > 2 && (
            <Chip size="sm" variant="flat">+{job.requirements.length - 2}</Chip>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
          <div>
            <p className="font-semibold text-primary">{job.salary}</p>
            <p className="text-xs text-muted">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <Button size="sm" color="primary" variant="shadow" as={Link} href={`/jobs/${job._id}`}>
            View Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="bg-surface border border-border h-full flex flex-col">
      <CardBody className="p-6 flex flex-col flex-grow animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-default-200 rounded-lg"></div>
          <div className="w-20 h-6 bg-default-200 rounded-full"></div>
        </div>
        <div className="w-3/4 h-6 bg-default-200 rounded-lg mb-2"></div>
        <div className="w-1/2 h-4 bg-default-200 rounded-lg mb-4"></div>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          <div className="w-16 h-6 bg-default-200 rounded-full"></div>
          <div className="w-20 h-6 bg-default-200 rounded-full"></div>
          <div className="w-14 h-6 bg-default-200 rounded-full"></div>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
          <div className="w-24 h-6 bg-default-200 rounded-lg"></div>
          <div className="w-24 h-8 bg-default-200 rounded-lg"></div>
        </div>
      </CardBody>
    </Card>
  );
}
