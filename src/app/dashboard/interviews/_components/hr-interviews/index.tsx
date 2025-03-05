import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { prisma } from "@/lib/db"
import { BarChart, Edit, Plus } from "lucide-react"
import Link from "next/link"
import CreateInterviewDialog from "./create-dialog"

const HrInterview = async ({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: "hr" | "user";
  };
}) => {
  const interviews = await prisma.interview.findMany({
    where: { hrHrId: user.id },
  });

  return (
    <main className="p-10 h-full w-full flex flex-col gap-10">
      <div className="border-b w-full flex items-center justify-between px-8 py-4">
        <h1 className="text-4xl font-bold">Interviews</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus />
              Create Interview
            </Button>
          </DialogTrigger>
          <CreateInterviewDialog />
        </Dialog>
      </div>
      {interviews.length > 0 ? (
        <div className="w-full gap-10 grid grid-cols-3 px-4">
          {interviews.map((view) => (
            <div
              key={view.id}
              className="border rounded-md p-4 flex flex-col gap-2"
            >
              <h1 className="text-xl font-bold">{view.role}</h1>
              <p className="text-sm line-clamp-4 text-pretty">
                {view.description}
              </p>
              <div className="w-full flex items-center justify-between gap-3">
                <h1 className="bg-muted text-muted-foreground rounded-md py-1 px-2 text-sm capitalize">
                  {view.type}
                </h1>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/interviews/details/${view.id}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <Edit />
                    Edit
                  </Link>
                  <Link
                    href="/"
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    <BarChart />
                    Scores
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-2xl font-bold">No Interviews Found</h1>
        </div>
      )}
    </main>
  );
};

export default HrInterview
