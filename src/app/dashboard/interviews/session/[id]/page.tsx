import { prisma } from "@/lib/db";
import SessionComponent from "../_components/session-component";
import { getUser } from "@/actions/user-actions";
import { redirect } from "next/navigation";
import DynamicComponent from "../_components/dynamic-component";

const Session = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/dashboard");

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: {
      Questions: {
        include: {
          answers: {
            where: {
              userId: user.id,
            },
          },
        },
      },
    },
  });

  if (!interview) {
    return <div>Interview not found</div>;
  }

  

  if (interview.type === "dynamic") {
    return <DynamicComponent interview={interview} userId={user.id} />;
  }

  return <SessionComponent interview={interview} />;
};

export default Session;
