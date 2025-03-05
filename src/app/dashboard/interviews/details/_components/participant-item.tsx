"use client";
import { addParticipant } from "@/actions/interview-actions";
import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import type { Interview, User } from "@prisma/client";
import { Check, Loader2, Plus } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";

const ParticipantsItem = ({
  user,
  interviewId,
  fetchUsers,
}: {
  user: User & { Interview: Interview[] };
  interviewId: string;
  fetchUsers: () => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const isUserInInterview = user.Interview.some(
    (interview) => interview.id === interviewId
  );

  const handleAddParticipant = async () => {
    setIsLoading(true);
    const response = await addParticipant(interviewId, user.userId);
    if (response.ok) {
      toast.success("Participant added successfully");
    } else {
      toast.error(response.message);
    }
    await fetchUsers();
    setIsLoading(false);
  };

  return (
    <CommandItem
      key={user.userId}
      className="flex w-full items-center justify-between p-4"
    >
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">{user.name}</h3>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      {isUserInInterview ? (
        <Button variant="default" size="icon" className="h-8 w-8">
          <Check className="text-background" />
        </Button>
      ) : (
        <Button
          disabled={isLoading}
          variant="default"
          size="sm"
          onClick={handleAddParticipant}
        >
          {isLoading ? (
            <Loader2 className="animate-spin text-background" />
          ) : (
            <Plus className="text-background" />
          )}{" "}
          Add
        </Button>
      )}
    </CommandItem>
  );
};

export default ParticipantsItem;
