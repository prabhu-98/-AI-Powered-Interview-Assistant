"use client";
import { chatSession } from "@/lib/gemini";
import { generateQuestionPrompt } from "@/lib/prompts";
import type { Answers, Interview, Questions } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DynamicQuestion from "./dynamic-question";
import { addQuestion, addScoreAndNextQuestion } from "@/actions/interview-actions";
import { evaluateAnswer } from "@/actions/gemini-actions";

export default function DynamicComponent({
  interview,
  userId,
}: {
  interview: Interview & { Questions: (Questions & { answers: Answers[] })[] };
  userId: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<
    (Questions & { answers: Answers[] })[]
  >(
    interview.Questions.sort(
      (a, b) => (a.answers[0]?.number ?? 1) - (b.answers[0]?.number ?? 0)
    )
  );
  const [presendIndex, setPresentIndex] = useState<number>(0);
  const [presentQuestion, setPresentQuestion] = useState<
    Questions & { answers: Answers[] }
  >(questions[presendIndex]);

  const generateQuestion = async (answer?: string) => {
    if (!isLoading && !answer) setIsLoading(true);

    try {
      if (questions.length === 10) {
        if (!answer) {
          toast.error("please enter a valid answer");
          return;
        }
        const response = await evaluateAnswer(
          presentQuestion.content,
          answer,
          presentQuestion.id
        );
        if (response.ok) {
          toast.success("Question answered successfully");
        } else {
          toast.error(response.message);
        }
        return;
      }
      let prompt: string = "";
      if (questions.length < 1) {
        prompt = generateQuestionPrompt({
          startQuestion: {
            jobPosition: interview.role,
            jobDescription: interview.description,
            jobExperience: interview.experience,
          },
        });
      } else {
        prompt = generateQuestionPrompt({
          nextQuestion: {
            question: questions[questions.length - 1].content,
            answer: answer || "",
            context: questions[questions.length - 1].context,
          },
        });
      }

      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{.*?\}/s);
      if (!jsonMatch) {
        throw new Error("No valid JSON array found in the response");
      }
      if (answer) {
        const data = JSON.parse(jsonMatch[0]) as {
          rating: number;
          feedback: string;
          next_question: string;
          context_keywords: string[];
        };
        const response = await addScoreAndNextQuestion({
          context: data.context_keywords,
          feedback: data.feedback,
          interviewId: interview.id,
          nextQuestion: data.next_question,
          number: questions.length + 1,
          score: data.rating,
          userId,
          answerId: questions[questions.length - 1].answers[0]?.id,
          answer: answer,
        });
        if (response.ok) {
          toast.success("Question answered successfully");
          setQuestions((prev) => {
            prev[presendIndex].answers[0].status = "completed";
            return [...prev, response.data];
          });
        } else {
          throw new Error(response.message);
        }
        return;
      } else {
        const data = JSON.parse(jsonMatch[0]) as {
          question: string;
          context_keywords: string[];
        };
        const response = await addQuestion(
          interview.id,
          userId,
          data.question,
          data.context_keywords,
          questions.length + 1
        );
        if (response.ok) {
          setQuestions((prev) => [...prev, response.data]);
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
    isLoading && setIsLoading(false);
  };

  const handleNextQuestion = () => {
    setPresentIndex((prev) => prev + 1);
  };

  const handlePreviousQuestion = () => {
    setPresentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    setPresentQuestion(questions[presendIndex]);
  }, [presendIndex]);

  useEffect(() => {
    if (questions.length === 0) {
      generateQuestion();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center gap-6 bg-accent text-accent-foreground rounded-lg px-16 py-8">
          <Loader2 className="animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DynamicQuestion
      question={presentQuestion}
      role={interview.role}
      index={presendIndex}
      generateQuestion={generateQuestion}
      setNextQuestion={handleNextQuestion}
      setPreviousQuestion={handlePreviousQuestion}
    />
  );
}
