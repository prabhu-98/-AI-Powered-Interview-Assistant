import ChatBot from "@/components/chat-bot";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Check, Edit } from "lucide-react";
import Link from "next/link";

const UserInterviews = async ({
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
    where: {
      Users: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      Questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  return (
    <main className="p-10 h-full w-full flex flex-col gap-10">
      <div className="border-b w-full px-8 py-4">
        <h1 className="text-4xl font-bold">Interviews</h1>
      </div>
      <div>
        {interviews.length > 0 ? (
          <div className="w-full grid grid-cols-3 gap-10 px-4">
            {interviews.map((view) => {
              const completed = view.Questions.every((question) =>
                question.answers.every(
                  (answer) => answer.status === "completed"
                )
              );

              return (
                <div
                  key={view.id}
                  className="border rounded-md p-4 flex flex-col gap-2"
                >
                  <h1 className="text-xl font-bold">{view.role}</h1>
                  <p className="text-sm line-clamp-4 text-pretty">
                    {view.description}
                  </p>
                  {completed && view.Questions.length === 10 ? (
                    <p className={buttonVariants({ variant: "secondary" })}>
                      <Check />
                      Completed
                    </p>
                  ) : (
                    <Link
                      href={`/dashboard/interviews/session/${view.id}`}
                      className={buttonVariants({
                        variant: "default",
                        className: "mt-2",
                      })}
                    >
                      <Edit />
                      Attend Interview
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center py-16">
            <h1 className="text-3xl font-bold">No Interviews Found</h1>
            <p>Contact your HR to get an interview</p>
          </div>
        )}
      </div>
      <ChatBot />
    </main>
  );
};

export default UserInterviews;
