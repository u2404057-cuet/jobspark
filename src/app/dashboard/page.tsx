"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, Link, Skeleton } from "@heroui/react";
import { JobCard, Job } from "@/components/jobs/JobCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard/stats');
      return response.data;
    },
    enabled: !!session,
  });

  const isLoading = isSessionLoading || isStatsLoading;

  // Dummy chart data representing views over time
  const chartData = [
    { name: "Mon", views: 40 },
    { name: "Tue", views: 30 },
    { name: "Wed", views: 60 },
    { name: "Thu", views: 45 },
    { name: "Fri", views: 90 },
    { name: "Sat", views: 65 },
    { name: "Sun", views: 85 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session?.user?.name || "User"}!
          </h1>
          <p className="text-muted mt-2">Here's what's happening with your jobs today.</p>
        </div>
        <div className="flex gap-4">
          <a href="/jobs/add" className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity">
            Post New Job
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Jobs Posted", value: stats?.totalJobs || 0, icon: "📁", color: "text-blue-500" },
          { label: "Active Listings", value: stats?.activeJobs || 0, icon: "🟢", color: "text-success" },
          { label: "Total Views", value: stats?.totalViews || 0, icon: "👀", color: "text-secondary" },
        ].map((stat, index) => (
          <Card key={index} className="bg-surface border border-border">
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-muted text-sm font-medium mb-1">{stat.label}</p>
                {isLoading ? (
                  <Skeleton className="h-10 w-20 rounded-lg" />
                ) : (
                  <h3 className="text-4xl font-bold">{stat.value}</h3>
                )}
              </div>
              <div className={`text-4xl ${stat.color} opacity-80`}>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-surface border border-border h-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6">Profile Views (This Week)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94A3B8"
                      tick={{ fill: '#94A3B8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94A3B8"
                      tick={{ fill: '#94A3B8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                      itemStyle={{ color: '#F1F5F9' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#6366F1" 
                      strokeWidth={4}
                      dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card className="bg-surface border border-border h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Recent Jobs</h3>
                <Link className="text-sm">View All</Link>
              </div>
              
              <div className="flex flex-col gap-4">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="space-y-2 flex-grow">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : stats?.recentJobs?.length === 0 ? (
                  <p className="text-muted text-center py-8">No recent jobs found.</p>
                ) : (
                  stats?.recentJobs?.map((job: Job) => (
                    <div key={job._id} className="flex gap-4 items-center p-3 rounded-lg hover:bg-background/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                        <p className="text-xs text-muted">{job.status === 'open' ? '🟢 Active' : '🔴 Closed'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
