import { Card, CardContent, Chip, Link } from "@heroui/react";

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
  logoUrl?: string;
  description?: string;
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="bg-surface border border-border h-full flex flex-col hover:border-slate-800 transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          {job.logoUrl ? (
            <img 
              src={job.logoUrl} 
              alt={`${job.company} Logo`} 
              className="w-12 h-12 rounded-lg object-cover border border-slate-800 bg-slate-900/50"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to showing company initial if image fails
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=6366F1&color=fff`;
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-xl text-primary">
              {job.company.charAt(0).toUpperCase()}
            </div>
          )}
          <Chip size="sm" variant="soft">
            {job.type}
          </Chip>
        </div>
        <h3 className="text-xl font-bold mb-1 line-clamp-1 text-white">{job.title}</h3>
        <p className="text-primary text-xs font-semibold mb-3">{job.company} • {job.location}</p>
        
        <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
          {job.description || "Join our team and help build the future of our product in this role."}
        </p>

        <div className="flex gap-1.5 mb-6 flex-wrap">
          <Chip size="sm" variant="soft" className="bg-slate-800/80 border border-slate-700/30 text-slate-300">{job.category}</Chip>
          {job.requirements?.slice(0, 1).map((req, i) => (
            <Chip key={i} size="sm" variant="soft" className="bg-slate-800/80 border border-slate-700/30 text-slate-300 truncate max-w-[120px]">{req}</Chip>
          ))}
          {job.requirements?.length > 1 && (
            <Chip size="sm" variant="soft" className="bg-slate-800/80 border border-slate-700/30 text-slate-300">+{job.requirements.length - 1}</Chip>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
          <div>
            <p className="font-bold text-primary text-sm">{job.salary}</p>
            <p className="text-[10px] text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <a href={`/jobs/${job._id}`} className="bg-primary text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-primary/20 cursor-pointer">
            View Details
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="bg-surface border border-border h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-grow animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-slate-800 rounded-lg"></div>
          <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
        </div>
        <div className="w-3/4 h-6 bg-slate-800 rounded-lg mb-2"></div>
        <div className="w-1/2 h-4 bg-slate-800 rounded-lg mb-4"></div>
        <div className="w-full h-8 bg-slate-800 rounded-lg mb-4"></div>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          <div className="w-16 h-6 bg-slate-800 rounded-full"></div>
          <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
          <div className="w-20 h-6 bg-slate-800 rounded-lg"></div>
          <div className="w-24 h-8 bg-slate-800 rounded-lg"></div>
        </div>
      </CardContent>
    </Card>
  );
}
