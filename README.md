# ⚡ JobSpark AI - Frontend Client

JobSpark AI is a modern, AI-powered job portal built with Next.js 16 (App Router), TypeScript, and Tailwind CSS. It provides job seekers and employers with seamless job discovery, management, and real-time AI career coaching powered by the Groq Llama-3 model.

---

## ✨ Features

- 🎯 **Job Discovery & Exploration**: Browse job listings with instant title/company search, multi-category filters, job type selection, and paginated navigation.
- ⚡ **AI Career Coach (`/ai-coach`)**: Real-time streaming career advisor powered by Groq LLM (`llama-3.3-70b-versatile`) with chat history session management.
- ✍️ **AI Job Description Generator (`/jobs/add`)**: Employers can auto-generate structured, compelling job descriptions with a single click based on job title and requirements.
- 🛠️ **Manage Job Listings (`/jobs/manage`)**: View and manage posted jobs with dark-themed custom confirmation modals and loading skeletons.
- 🔐 **Authentication System**: Integrated Better Auth client supporting Google OAuth 2.0 social sign-in and Email/Password credentials.
- 📱 **Fully Responsive & Modern UI**: Built with a sleek dark aesthetic, 4-column desktop card layout, smooth animations, glassmorphism elements, and responsive navbar avatar controls.
- 📑 **Static & Support Pages**: Includes About Us, Contact, Blog, Terms of Service, and Privacy Policy.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, HeroUI
- **State & Data Fetching**: TanStack Query (React Query)
- **Authentication**: Better Auth Client (`better-auth/react`)
- **HTTP Client**: Axios & Fetch API (for streaming)
- **Icons**: Lucide React & Heroicons

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/u2404057-cuet/jobspark.git
   cd jobspark
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and set the backend API endpoint:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Folder Structure

```text
src/
├── app/                  # Next.js App Router pages & API handlers
│   ├── (auth)/           # Login & Register pages
│   ├── ai-coach/         # AI Career Coach streaming page
│   ├── jobs/             # Browse, Add, Manage & Job Detail pages
│   ├── about/            # About Us page
│   ├── contact/          # Contact page
│   ├── privacy/          # Privacy Policy page
│   └── terms/            # Terms of Service page
├── components/           # Shared UI components & Layouts
│   ├── jobs/             # JobCard & Skeleton components
│   └── layout/           # Navbar, Footer & Container components
└── lib/                  # Auth client & API Axios configurations
```

---

## 🌐 Deployment (Vercel)

1. Connect the repository to [Vercel](https://vercel.com).
2. Set the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend server URL (e.g., `https://jobspark-server.vercel.app`).
3. Deploy!
