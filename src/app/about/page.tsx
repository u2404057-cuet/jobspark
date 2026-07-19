export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About JobSpark AI</h1>
      <div className="prose prose-invert lg:prose-xl mx-auto text-muted">
        <p className="mb-6">
          JobSpark AI is a revolutionary platform designed to bridge the gap between talented professionals and their dream careers. We believe that finding a job shouldn't be a full-time job in itself.
        </p>
        <p className="mb-6">
          By leveraging cutting-edge Artificial Intelligence, we've created a seamless ecosystem where candidates can not only find the best opportunities but also receive personalized coaching, resume reviews, and interview preparation.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">Our Mission</h2>
        <p className="mb-6">
          To empower every professional with the tools and guidance they need to succeed in their career journey, making the hiring process transparent, efficient, and fair for everyone.
        </p>
      </div>
    </div>
  );
}
