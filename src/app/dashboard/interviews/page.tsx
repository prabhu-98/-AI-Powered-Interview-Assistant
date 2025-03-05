import { getUser } from "@/actions/user-actions"
import HrInterview from "./_components/hr-interviews"
import { redirect } from "next/navigation"
import UserInterviews from "./_components/user-interviews"

const InterviewsPage = async () => {
  const user = await getUser()
  if (!user) redirect("/login")

  if (user.role === "user") {
    return <UserInterviews user={user} />;
  }
  return <HrInterview user={user} />;
}

export default InterviewsPage
