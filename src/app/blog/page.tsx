export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">JobSpark Blog</h1>
        <p className="text-muted text-xl max-w-2xl mx-auto">
          Insights, advice, and stories to help you navigate your career path.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder blog posts */}
        {[
          { title: "How to Ace Your Next AI Interview", date: "Oct 12, 2024", category: "Interviewing" },
          { title: "Top 5 Resume Mistakes to Avoid in 2024", date: "Oct 05, 2024", category: "Resume Tips" },
          { title: "The Future of Remote Work", date: "Sep 28, 2024", category: "Industry Trends" },
          { title: "Negotiating Salary Like a Pro", date: "Sep 15, 2024", category: "Career Advice" },
          { title: "Switching Careers? Start Here", date: "Sep 02, 2024", category: "Career Change" },
          { title: "Building a Portfolio That Stands Out", date: "Aug 20, 2024", category: "Design" }
        ].map((post, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
            <div className="h-48 bg-background/50 border-b border-border flex items-center justify-center text-4xl">
              📝
            </div>
            <div className="p-6">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">{post.category}</span>
              <h3 className="text-xl font-bold mt-2 mb-3">{post.title}</h3>
              <p className="text-sm text-muted">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
