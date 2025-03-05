"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Answers, Questions } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";

export default function DynamicQuestion({
  question,
  role,
  index,
  generateQuestion,
  setNextQuestion,
  setPreviousQuestion,
}: {
  question: Questions & { answers: Answers[] };
  role: string;
  index: number;
  generateQuestion: (answer?: string) => Promise<void>;
  setNextQuestion: () => void;
  setPreviousQuestion: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
await generateQuestion(answer);
    setIsLoading(false);
  };

  useEffect(() => {
    setAnswer(question.answers[0].content || "");
  }, [question]);

  return (
    <main className="h-full w-full p-10 grid grid-cols-2">
      <div className="w-full h-full flex flex-col gap-10">
        <div className="flex flex-col">
          <p className="text-sm">Interview for</p>
          <h1 className="text-2xl font-bold">{role}</h1>
        </div>
        <div className="flex flex-col p-6 gap-1">
          <h3>Question {index + 1}</h3>
          <p className="text-xl font-semibold">{question.content}</p>
        </div>
        <div className="flex flex-col gap-4">
          <p>Give your answer here</p>
          <Textarea
            className="w-full h-full resize-none text-lg"
            rows={20}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex h-fit items-center justify-evenly *:w-full gap-6 px-6">
            <Button
              variant="destructive"
              // onClick={() => resetTranscript()}
            >
              Clear
            </Button>
            <Button
              // onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? "Stop" : "Record"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={question.answers[0].status === "completed" || isLoading}
            >
              {isLoading && <Loader2 className="animate-spin" />}Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-10 items-center justify-center">
        <div className="aspect-square rounded-lg w-1/2 mx-auto relative">
          <Webcam
            audio
            mirrored
            className="rounded-lg h-full w-full absolute inset-0"
          />
        </div>
        <div className="flex items-center justify-evenly w-1/2 mx-auto gap-4">
          <Button
            size="lg"
            disabled={index === 0}
            onClick={setPreviousQuestion}
          >
            <ArrowLeft /> Previous Question
          </Button>
          <Button
            size="lg"
            disabled={question.answers[0].status === "pending"}
            onClick={setNextQuestion}
          >
            {index === 9 ? (
              <>Dashboard</>
            ) : (
              <>
                Next Question <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
