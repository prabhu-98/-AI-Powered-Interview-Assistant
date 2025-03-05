"use client";
import { createInterview } from "@/actions/interview-actions";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CreateInterviewDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    role: string;
    description: string;
    interviewType: "predefined" | "dynamic";
    experience: number;
  }>({
    role: "",
    description: "",
    interviewType: "predefined",
    experience: 0,
  });

  const handleCreateInterview = async () => {
    setIsLoading(true);
    if (
      !data.role.length ||
      !data.description.length ||
      !data.interviewType ||
      !data.experience
    ) {
      toast.error("Please fill all the fields");
      setIsLoading(false);
      return;
    }
    data.interviewType
    const response = await createInterview({ ...data });
    if (!response.ok) {
      toast.error(response.message);
      setIsLoading(false);
      return;
    }
    toast.success("Interview created successfully");
    redirect("/dashboard/interviews/details/" + response.data.id);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Interview</DialogTitle>
        <DialogDescription>
          Fill the below details to continue
        </DialogDescription>
      </DialogHeader>
      <div className="w-full flex flex-col gap-8 py-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="job-role">Job Role</Label>
          <Input
            id="job-role"
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            placeholder="e.g. Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            rows={10}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="e.g. We are looking for a software engineer with 3 years of experience in React and Node.js"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="interview-type">Interview Type</Label>
          <Select
            value={data.interviewType}
            onValueChange={(value) =>
              setData({
                ...data,
                interviewType: value as "predefined" | "dynamic",
              })
            }
          >
            <SelectTrigger id="interview-type" className="w-full">
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="predefined">Predefined Questions</SelectItem>
              <SelectItem value="dynamic">Dynamic Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="experience">Experience</Label>
          <Input
            id="experience"
            type="number"
            value={data.experience}
            onChange={(e) =>
              setData({
                ...data,
                experience: parseInt(e.target.value) || 0,
              })
            }
            placeholder="e.g. 3"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
        <Button disabled={isLoading} onClick={handleCreateInterview}>
          {isLoading && <Loader2 className="animate-spin" />} Create
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateInterviewDialog;
