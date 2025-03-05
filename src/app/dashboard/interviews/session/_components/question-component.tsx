"use client";
import { evaluateAnswer } from "@/actions/gemini-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Answers, Questions } from "@prisma/client";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

const QuestionComponent = ({
  question,
  role,
  index,
  setNextQuestion,
  setPreviousQuestion,
  changeAnswer,
}: {
  question: Questions & { answers: Answers[] };
  role: string;
  index: number;
  setNextQuestion: () => void;
  setPreviousQuestion: () => void;
  changeAnswer: (questionId: string, answer: Answers) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  let recognizer: SpeechRecognition | null = null;

  const startRecording = () => {
     recognizer = new (window.SpeechRecognition ||
       window.webkitSpeechRecognition)();
    recognizer.lang = "en-IN";
    recognizer.continuous = true;
    recognizer.interimResults = true;

    recognizer.onresult = (event) => {
      const speechResult = event.results[event.resultIndex][0].transcript;
      setTranscript(speechResult);
    };

    recognizer.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognizer?.stop();
    setIsRecording(false);
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  useEffect(() => {
    setAnswer(question.answers[0].content || "");
    setIsPageLoading(false);
  }, [index]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await evaluateAnswer(
      question.content,
      answer,
      question.answers[0].id
    );
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success(
      index === 9 ? "Interview completed" : "Answer submitted successfully"
    );
    changeAnswer(question.id, res.data);
    setIsLoading(false);
  };

  if (isPageLoading) {
    return (
      <main className="w-full h-full flex flex-col gap-4 items-center justify-center text-3xl font-bold">
        <Loader2 className="animate-spin h-8 w-8" />
      </main>
    );
  }

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
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <div className="flex h-fit items-center justify-evenly *:w-full gap-6 px-6">
            <Button variant="destructive" onClick={() => clearTranscript()}>
              Clear
            </Button>
            <Button
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? "Stop" : "Record"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={question.answers[0].status === "completed"}
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
};

export default QuestionComponent;
