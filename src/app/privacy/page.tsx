export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-slate-300">
      <h1 className="text-4xl font-extrabold text-white mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last Updated: July 20, 2026</p>
      
      <div className="space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when creating an account, posting jobs, applying for positions, or communicating with our AI career coach. This includes your name, email address, password, profile picture, resume details, and messages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide and improve JobSpark AI services, including matching you with relevant job opportunities, facilitating the application process, and processing your interactions with our agentic AI Career Coach and generator tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">3. Data Sharing & Security</h2>
          <p>
            We do not sell your personal data. We only share details with employers when you explicitly apply for a job. We implement robust database encryption and authentication protocols to safeguard your personal credentials and session data.
          </p>
        </section>
      </div>
    </div>
  );
}
