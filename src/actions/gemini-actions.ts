"use server";
import { prisma } from "@/lib/db";
import { chatSession } from "@/lib/gemini";
import {
  evaluateAnswerPrompt,
  generatePredefinedQuestionsPrompts,
} from "@/lib/prompts";
import type { Answers } from "@prisma/client";

export const generatePredefinedQuestions = async (data: {
  jobRole: string;
  jobDescription: string;
  experience: number;
}) => {
  const prompt = generatePredefinedQuestionsPrompts(data);
  const result = await chatSession.sendMessage(prompt);
  const responseText = result.response.text();
  const jsonMatch = responseText.match(/\[.*?\]/s);
  if (!jsonMatch) {
    throw new Error("No valid JSON array found in the response");
  }

  return JSON.parse(jsonMatch[0]) as { question: string; category: string }[];
};

export const evaluateAnswer = async (
  question: string,
  answer: string,
  answerId: string
): Promise<{ ok: true; data: Answers } | { ok: false; message: string }> => {
  try {
    const result = await chatSession.sendMessage(
      evaluateAnswerPrompt({ answer, question })
    );
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{.*?\}/s);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in the response");
    }

    const data = JSON.parse(jsonMatch[0]) as {
      rating: number;
      feedback: string;
    };
    console.log(typeof data.rating);
    
    const dbRes = await prisma.answers.update({
      where: { id: answerId },
      data: {
        score: data.rating,
        status: "completed",
        feedback: data.feedback,
        content: answer,
      },
    });

    return {
      ok: true,
      data: dbRes,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
