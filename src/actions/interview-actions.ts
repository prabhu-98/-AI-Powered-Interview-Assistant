"use server";
import { prisma } from "@/lib/db";
import type {
  Answers,
  Interview,
  InterviewType,
  Questions,
  User,
} from "@prisma/client";
import { generatePredefinedQuestions } from "./gemini-actions";
import { getUser } from "./user-actions";

export const createInterview = async (data: {
  role: string;
  description: string;
  interviewType: "predefined" | "dynamic";
  experience: number;
}): Promise<{ ok: false; message: string } | { ok: true; data: Interview }> => {
  try {
    const user = await getUser();
    if (!user || user.role !== "hr") throw new Error("User not found");

    let interviewData = null;
    if (data.interviewType === "predefined") {
      const questions = await generatePredefinedQuestions({
        experience: data.experience,
        jobDescription: data.description,
        jobRole: data.role,
      });

      interviewData = await prisma.interview.create({
        data: {
          description: data.description,
          role: data.role,
          type: data.interviewType as InterviewType,
          experience: data.experience,
          organizer: {
            connect: {
              hrId: user.id,
            },
          },
          Questions: {
            create: questions.map((question) => ({
              content: question.question,
            })),
          },
        },
      });
    } else {
      interviewData = await prisma.interview.create({
        data: {
          description: data.description,
          role: data.role,
          type: data.interviewType as InterviewType,
          experience: data.experience,
          organizer: {
            connect: {
              hrId: user.id,
            },
          },
        },
      });
    }

    return {
      ok: true,
      data: interviewData,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getQuestions = async (
  interviewId: string
): Promise<
  | { ok: false; message: string }
  | { ok: true; data: Interview & { Questions: Questions[]; Users: User[] } }
> => {
  try {
    const questions = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      include: {
        Questions: true,
        Users: true,
      },
    });
    if (!questions) throw new Error("Interview not found");

    return {
      ok: true,
      data: questions,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const addParticipant = async (interviewId: string, userId: string) => {
  try {
    const res = await getQuestions(interviewId);
    if (!res.ok) throw new Error(res.message);

    const {
      data: { Questions },
    } = res;

    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        Users: { connect: { userId } },
        Questions: {
          update: Questions.map((question) => ({
            where: { id: question.id },
            data: {
              answers: {
                create: {
                  User: {
                    connect: { userId },
                  },
                },
              },
            },
          })),
        },
      },
      include: {
        Questions: {
          include: {
            answers: true,
          },
        },
        Users: true,
      },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const addQuestion = async (
  interviewId: string,
  userId: string,
  question: string,
  context: string[],
  number: number
): Promise<
  | { ok: false; message: string }
  | { ok: true; data: Questions & { answers: Answers[] } }
> => {
  try {
    const dbResponse = await prisma.questions.create({
      data: {
        content: question,
        context,
        Interview: {
          connect: {
            id: interviewId,
          },
        },
        answers: {
          create: {
            User: {
              connect: {
                userId,
              },
            },
            number,
          },
        },
      },
      include: {
        answers: {
          where: {
            userId,
          },
        },
      },
    });

    return {
      ok: true,
      data: dbResponse,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const addScoreAndNextQuestion = async ({
  answerId,
  userId,
  score,
  feedback,
  nextQuestion,
  context,
  interviewId,
  number,
  answer,
}: {
  answerId: string;
  userId: string;
  score: number;
  feedback: string;
  nextQuestion: string;
  interviewId: string;
  context: string[];
  number: number;
  answer: string;
}): Promise<
  | { ok: false; message: string }
  | { ok: true; data: Questions & { answers: Answers[] } }
> => {
  try {
    await prisma.answers.update({
      where: {
        id: answerId,
      },
      data: {
        score: parseInt(score as any as string),
        status: "completed",
        feedback,
        content: answer,
      },
    });

    const response = await addQuestion(
      interviewId,
      userId,
      nextQuestion,
      context,
      number
    );
    if (!response.ok) throw new Error(response.message);

    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
