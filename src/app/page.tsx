import { Link, Chip } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Chip  variant="soft" className="mb-6 mx-auto">
            Powered by JobSpark AI
          </Chip>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Dream Career
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
            Join thousands of professionals finding their perfect role. Let our AI career coach guide you every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/jobs" className="bg-primary text-white h-12 px-8 rounded-xl font-medium flex items-center justify-center hover:opacity-90 transition-opacity">
              Find Jobs
            </a>
            <a href="/jobs/add" className="bg-default-100 text-foreground h-12 px-8 rounded-xl font-medium flex items-center justify-center hover:bg-default-200 transition-colors">
              Post a Job
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Jobs", value: "10K+" },
              { label: "Companies", value: "2.5K+" },
              { label: "Success Stories", value: "15K+" },
              { label: "AI Matches", value: "50K+" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
                <p className="text-muted font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Explore open roles across top industries and find where you belong.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Software Engineering", jobs: "3,240 jobs", icon: "💻" },
              { title: "Design & UX", jobs: "1,520 jobs", icon: "🎨" },
              { title: "Marketing", jobs: "2,100 jobs", icon: "📈" },
              { title: "Data Science", jobs: "1,850 jobs", icon: "📊" },
              { title: "Product Management", jobs: "940 jobs", icon: "🎯" },
              { title: "Sales", jobs: "4,200 jobs", icon: "💼" },
              { title: "Finance", jobs: "1,100 jobs", icon: "💰" },
              { title: "Customer Success", jobs: "2,300 jobs", icon: "🤝" }
            ].map((cat, i) => (
              <a key={i} href={`/jobs?category=${cat.title.toLowerCase()}`} className="block border border-border/50 bg-surface/50 hover:border-primary/50 transition-colors rounded-xl overflow-hidden">
                <div className="p-6 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{cat.title}</h3>
                    <p className="text-muted text-sm">{cat.jobs}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Jobs</h2>
              <p className="text-muted max-w-2xl">
                Discover the latest opportunities from top companies.
              </p>
            </div>
            <a href="/jobs" className="hidden sm:flex bg-primary/10 text-primary px-6 py-2 rounded-xl font-medium items-center justify-center hover:bg-primary/20 transition-colors">
              View All Jobs
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dummy Featured Jobs - We'll replace this with real JobCard components later */}
            {[1, 2, 3].map((job) => (
              <div key={job} className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-xl">
                      C
                    </div>
                    <Chip size="sm"  variant="soft">Full Time</Chip>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Senior Frontend Developer</h3>
                  <p className="text-muted mb-4">Company Name • San Francisco, CA (Remote)</p>
                  <div className="flex gap-2 mb-6 flex-wrap">
                    <Chip size="sm" variant="soft">React</Chip>
                    <Chip size="sm" variant="soft">TypeScript</Chip>
                    <Chip size="sm" variant="soft">Next.js</Chip>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="font-semibold text-primary">$120k - $150k</p>
                    <a href="/jobs" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Apply Now</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <a href="/jobs" className="block w-full bg-primary/10 text-primary h-12 rounded-xl font-medium flex items-center justify-center hover:bg-primary/20 transition-colors">
              View All Jobs
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How JobSpark Works</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Your journey to a new career is just three simple steps away.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
            
            {[
              {
                step: "1",
                title: "Create an Account",
                desc: "Sign up and tell us about your skills, experience, and career goals.",
                icon: "👤"
              },
              {
                step: "2",
                title: "Get AI Matches",
                desc: "Our AI analyzes your profile and suggests jobs that perfectly fit your unique talents.",
                icon: "✨"
              },
              {
                step: "3",
                title: "Apply & Get Hired",
                desc: "Apply with one click and use our AI coach to prepare for your interviews.",
                icon: "🎉"
              }
            ].map((item, i) => (
              <div key={i} className="text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-surface border-4 border-background flex items-center justify-center text-4xl shadow-xl mb-6 relative">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Highlight Section */}
      <section className="py-24 bg-primary/5 border-y border-primary/10 overflow-hidden relative">
        <div className="absolute -right-[20%] -top-[20%] w-[50%] h-[150%] bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Chip  variant="primary" className="mb-6">
                ✨ Meet Your AI Career Coach
              </Chip>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Supercharge your career with Artificial Intelligence
              </h2>
              <p className="text-lg text-muted mb-8">
                Don't navigate the job market alone. Our AI assistant helps you write better cover letters, prepare for tough interview questions, and negotiate your salary like a pro.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Personalized interview prep based on the job description",
                  "Resume review and optimization suggestions",
                  "Salary negotiation strategies and scripts",
                  "Career path planning and skill gap analysis"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="/ai-coach" className="inline-flex bg-primary text-white h-12 px-8 rounded-xl font-medium items-center justify-center shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity">
                Chat with AI Coach
              </a>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl transform rotate-3 scale-105" />
              <div className="bg-surface border border-border shadow-2xl relative z-10 rounded-xl overflow-hidden">
                <div className="border-b border-border p-4 bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <p className="ml-2 font-mono text-xs text-muted">AI Career Coach</p>
                  </div>
                </div>
                <div className="p-6 h-[400px] flex flex-col gap-4 overflow-hidden">
                  <div className="flex gap-4 w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
                    <div className="bg-background rounded-2xl rounded-tl-none p-4 text-sm shadow-sm border border-border">
                      Hi! I'm your AI Career Coach. How can I help you today?
                    </div>
                  </div>
                  <div className="flex gap-4 w-[80%] self-end flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex-shrink-0 flex items-center justify-center text-sm">👤</div>
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-4 text-sm shadow-sm">
                      I have an interview for a Senior React Developer role tomorrow. Can you help me prepare?
                    </div>
                  </div>
                  <div className="flex gap-4 w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
                    <div className="bg-background rounded-2xl rounded-tl-none p-4 text-sm shadow-sm border border-border">
                      Absolutely! For a Senior React role, you should expect questions on advanced state management, performance optimization (like useMemo/useCallback), and architecture. Let's start with a mock question: How would you handle state in a large-scale React application?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay z-0" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to spark your next career move?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Join thousands of professionals finding their perfect roles with JobSpark AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-white text-primary h-12 px-8 rounded-xl font-bold flex items-center justify-center hover:bg-default-100 transition-colors">
              Create Free Account
            </a>
            <a href="/jobs" className="border-2 border-white text-white h-12 px-8 rounded-xl font-medium flex items-center justify-center hover:bg-white/10 transition-colors">
              Browse Jobs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
