"use client";
import { getApplicants } from "@/actions/user-actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList
} from "@/components/ui/command";
import type { Interview, User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ParticipantsItem from "./participant-item";

const ParticipantsCommand = ({ interviewId }: { interviewId: string }) => {
  const [users, setUsers] = useState<
    (User & { Interview: Interview[] })[] | undefined
  >(undefined);

  const fetchUsers = async () => {
    const response = await getApplicants();
    if (response.ok) {
      setUsers(response.applicants);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Command>
      <CommandInput placeholder="Type a search applicants..." />
      {users === undefined ? (
        <div className="pt-4 flex justify-center items-center h-32">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <CommandList>
          <CommandEmpty>No applicants found.</CommandEmpty>
          <CommandGroup className="pt-4">
            {users.map((user) => (
              <ParticipantsItem
                key={user.userId}
                user={user}
                interviewId={interviewId}
                fetchUsers={fetchUsers}
              />
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
};

export default ParticipantsCommand;
