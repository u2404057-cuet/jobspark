import { Button, Link, Chip, Card, CardBody } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Chip color="primary" variant="dot" className="mb-6 mx-auto">
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
            <Button size="lg" color="primary" as={Link} href="/jobs">
              Browse Jobs
            </Button>
            <Button size="lg" variant="bordered" as={Link} href="/ai-coach">
              Meet Your AI Coach
            </Button>
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
              <Card key={i} isPressable as={Link} href={`/jobs?category=${cat.title.toLowerCase()}`} className="border border-border/50 bg-surface/50 hover:border-primary/50 transition-colors">
                <CardBody className="p-6 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{cat.title}</h3>
                    <p className="text-sm text-muted">{cat.jobs}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Additional sections will be added in subsequent tasks */}
    </div>
  );
}
