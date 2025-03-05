"use client";
import type { Answers, Interview, Questions } from "@prisma/client";
import { Suspense, useState } from "react";
import QuestionComponent from "./question-component";
import { useRouter } from "next/navigation";

const SessionComponent = ({
  interview,
}: {
  interview: Interview & { Questions: (Questions & { answers: Answers[] })[] };
}) => {
  const [questions, setQuestions] = useState<
    (Questions & { answers: Answers[] })[]
  >(interview.Questions);
  const [presentQuestion, setPresentQuestion] = useState<number>(0);
  const router = useRouter();
  const handleNextQuestion = () => {
    if (presentQuestion === 9) {
      router.push("/dashboard");
      return;
    }
    setPresentQuestion((prev) => prev + 1);
  };

  const handlePreviousQuestion = () => {
    setPresentQuestion((prev) => prev - 1);
  };

  const changeAnswer = (questionId: string, answer: Answers) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          return { ...question, answers: [answer] };
        }
        return question;
      })
    );
  };

  return (
    // <Suspense fallback={<div>Loading...</div>}>
    <QuestionComponent
      role={interview.role}
      question={questions[presentQuestion]}
      index={presentQuestion}
      setNextQuestion={handleNextQuestion}
      setPreviousQuestion={handlePreviousQuestion}
      changeAnswer={changeAnswer}
    />
    // </Suspense>
  );
};

export default SessionComponent;
