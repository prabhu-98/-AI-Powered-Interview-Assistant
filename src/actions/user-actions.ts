"use server";
import { prisma } from "@/lib/db";
import type { Interview, User } from "@prisma/client";
import { cookies } from "next/headers";

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    
    const existedUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    const existedHr = await prisma.hr.findUnique({
      where: { email: data.email },
    });

    const cookieStore = await cookies();

    if (!existedUser && !existedHr) {
      throw new Error("User not found");
    }


    if (existedHr && existedHr.password === data.password) {
      cookieStore.set(
        "user",
        JSON.stringify({
          id: existedHr.hrId,
          name: existedHr.name,
          email: existedHr.email,
          role: "hr",
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30,
        }
      );
    } else if (existedUser && existedUser.password === data.password) {
      
      cookieStore.set(
        "user",
        JSON.stringify({
          id: existedUser.userId,
          name: existedUser.name,
          email: existedUser.email,
          role: "user",
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30,
        }
      );
    } else {
      throw new Error("Invalid credentials");
    }

    return {
      ok: true,
      message: "Login successful",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const logoutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("user");
};

export const getUser = async () => {
  const cookieStore = await cookies()
  const user = cookieStore.get("user")
  if (!user) return null
  return JSON.parse(user.value) as {
    id: string;
    name: string;
    email: string;
    role: "hr" | "user";
  };
}

export const getApplicants = async (): Promise<
  | { ok: true; applicants: (User & { Interview: Interview[] })[] }
  | { ok: false; message: string }
> => {
  try {
    return {
      ok: true,
      applicants: await prisma.user.findMany({
        include: {
          Interview: true,
        },
      }),
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
