import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ParticipantsCommand from "./paticipants-command";

const ParticipantsDialog = ({
  interviewId,
  full,
}: {
  interviewId: string;
  full?: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className={full ? "h-full" : ""}>
          <Plus />
          Add Applicants
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Applicants</DialogTitle>
          <DialogDescription>
            Add applicants to the interview.
          </DialogDescription>
        </DialogHeader>

        <ParticipantsCommand interviewId={interviewId} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsDialog;
