"use client";

import { Input, Textarea, Button, Card, CardBody } from "@heroui/react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
          <p className="text-muted text-lg mb-8">
            Have questions about JobSpark AI? Need help with your account? Our team is here to support your career journey.
          </p>
          
          <div className="space-y-6 text-muted">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📧</span>
              <span>support@jobspark.ai</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl">📍</span>
              <span>123 Career Blvd, Tech City, CA 94000</span>
            </div>
          </div>
        </div>
        
        <Card className="bg-surface border border-border">
          <CardBody className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" variant="bordered" isRequired />
                <Input label="Last Name" variant="bordered" isRequired />
              </div>
              <Input label="Email" type="email" variant="bordered" isRequired />
              <Input label="Subject" variant="bordered" isRequired />
              <Textarea label="Message" variant="bordered" minRows={4} isRequired />
              <Button color="primary" size="lg" type="submit" className="mt-2">
                Send Message
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
