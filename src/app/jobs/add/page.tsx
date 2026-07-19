"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Input, Button, Select, SelectItem, Textarea, Card, CardBody } from "@heroui/react";
import toast from "react-hot-toast";

export default function PostJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full Time",
    category: "Software Engineering",
    salary: "",
    requirements: "",
    description: "",
  });

  const categories = [
    "Software Engineering", "Design & UX", "Marketing", "Data Science",
    "Product Management", "Sales", "Finance", "Customer Success"
  ];

  const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance"];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category || !formData.requirements) {
      toast.error("Please fill in Title, Category, and Requirements first.");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("AI is writing the description...");
    
    try {
      const requirementsList = formData.requirements.split('\n').filter(r => r.trim());
      const response = await api.post('/api/ai/generate-description', {
        title: formData.title,
        category: formData.category,
        requirements: requirementsList
      });
      
      setFormData(prev => ({ ...prev, description: response.data.description }));
      toast.success("Description generated!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to generate description", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim())
      };
      
      const response = await api.post('/api/jobs', payload);
      toast.success("Job posted successfully!");
      router.push(`/jobs/${response.data._id}`);
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
        <p className="text-muted">Fill out the details below to publish your open position.</p>
      </div>

      <Card className="bg-surface border border-border">
        <CardBody className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                isRequired
                label="Job Title"
                name="title"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={handleChange}
                variant="bordered"
              />
              <Input
                isRequired
                label="Company Name"
                name="company"
                placeholder="e.g. Acme Corp"
                value={formData.company}
                onChange={handleChange}
                variant="bordered"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                isRequired
                label="Location"
                name="location"
                placeholder="e.g. Remote, NY"
                value={formData.location}
                onChange={handleChange}
                variant="bordered"
              />
              <Select 
                isRequired
                label="Job Type" 
                name="type"
                variant="bordered"
                selectedKeys={[formData.type]}
                onChange={handleChange}
              >
                {jobTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </Select>
              <Select 
                isRequired
                label="Category" 
                name="category"
                variant="bordered"
                selectedKeys={[formData.category]}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </Select>
            </div>

            <Input
              isRequired
              label="Salary Range"
              name="salary"
              placeholder="e.g. $100k - $120k"
              value={formData.salary}
              onChange={handleChange}
              variant="bordered"
            />

            <Textarea
              isRequired
              label="Requirements (One per line)"
              name="requirements"
              placeholder="- 5+ years React experience\n- Strong TypeScript skills\n- Experience with Next.js"
              value={formData.requirements}
              onChange={handleChange}
              variant="bordered"
              minRows={4}
            />

            <div className="relative">
              <Textarea
                isRequired
                label="Job Description"
                name="description"
                placeholder="Describe the role in detail..."
                value={formData.description}
                onChange={handleChange}
                variant="bordered"
                minRows={8}
              />
              <Button 
                className="absolute top-2 right-2 z-10" 
                color="secondary" 
                size="sm" 
                variant="flat"
                onPress={handleGenerateDescription}
                isLoading={isGenerating}
                startContent={!isGenerating && <span>✨</span>}
              >
                AI Write
              </Button>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button variant="flat" onPress={() => router.back()}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading} size="lg">
                Post Job
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
