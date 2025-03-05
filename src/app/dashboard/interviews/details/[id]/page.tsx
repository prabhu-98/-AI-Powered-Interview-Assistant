import { getQuestions } from "@/actions/interview-actions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Plus } from "lucide-react";
import ParticipantsDialog from "../_components/participants-dialog";

const InterviewDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const response = await getQuestions(id);
  if (!response.ok) {
    return <div>{response.message}</div>;
  }
  const data = response.data;

  return (
    <section className="h-full w-full p-10 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <p>Interview for</p>
          <h1 className="text-3xl font-bold">{data.role}</h1>
          <p className="text-sm text-foreground/60 pt-4">{data.description}</p>
        </div>
      </div>
      <Tabs defaultValue="questions">
        <TabsList className="w-1/3 *:w-full *:text-base bg-background h-12 *:h-full">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
        </TabsList>
        <div className="h-px w-full bg-foreground/20"></div>
        <TabsContent
          value="questions"
          className="w-full p-4 flex flex-col gap-6"
        >
          {data.Questions.length > 0 ? (
            <>
              {data.Questions.map((question, index) => (
                <div
                  key={question.id}
                  className="bg-accent py-6 px-8 rounded-lg flex flex-col"
                >
                  <p className="text-sm text-muted-foreground">
                    Question {index + 1}
                  </p>
                  <h1 className="text-pretty flex-1">{question.content}</h1>
                </div>
              ))}
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-10 py-24">
              <h1 className="text-3xl font-bold">No questions yet</h1>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="participants"
          className="w-full p-4 flex flex-col gap-6"
        >
          {data.Users.length > 0 ? (
            <div className="w-full grid grid-cols-3 gap-4">
              {/* <Button
                asChild
                className="w-full h-full flex items-center justify-center"
              > */}
              <ParticipantsDialog interviewId={id} full />
              {/* </Button> */}
              {data.Users.map((user) => (
                <div
                  key={user.userId}
                  className="w-full bg-accent p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                  </div>
                  <Button>
                    <Edit /> Edit
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-10 py-24">
              <h1 className="text-3xl font-bold">No participants yet</h1>
              <ParticipantsDialog interviewId={id} />
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="scores"
          className="w-full p-4 flex flex-col gap-6"
        >
          <div className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-accent p-6 rounded-lg flex flex-col gap-2">
                <h3 className="text-lg font-medium">Average Score</h3>
                <p className="text-3xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Across all participants</p>
              </div>
              <div className="bg-accent p-6 rounded-lg flex flex-col gap-2">
                <h3 className="text-lg font-medium">Highest Score</h3>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">John Doe</p>
              </div>
              <div className="bg-accent p-6 rounded-lg flex flex-col gap-2">
                <h3 className="text-lg font-medium">Participants</h3>
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Completed interviews</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Performance by Question</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((questionNum) => (
                  <div key={questionNum} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Question {questionNum}</p>
                      <p className="text-sm">{Math.floor(65 + Math.random() * 30)}%</p>
                    </div>
                    <div className="w-full bg-accent rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${65 + Math.random() * 30}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {[
                    { name: "John Doe", score: 92 },
                    { name: "Jane Smith", score: 87 },
                    { name: "Alex Johnson", score: 83 }
                  ].map((user, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <p>{user.name}</p>
                      </div>
                      <p className="font-semibold">{user.score}%</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Areas for Improvement</h3>
                <div className="space-y-3">
                  {[
                    { area: "Technical Knowledge", score: 65 },
                    { area: "Communication Skills", score: 72 },
                    { area: "Problem Solving", score: 68 }
                  ].map((area, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <p>{area.area}</p>
                        <p className="text-sm font-medium">{area.score}%</p>
                      </div>
                      <div className="w-full bg-accent rounded-full h-2.5">
                        <div 
                          className="bg-destructive h-2.5 rounded-full" 
                          style={{ width: `${area.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default InterviewDetails;
