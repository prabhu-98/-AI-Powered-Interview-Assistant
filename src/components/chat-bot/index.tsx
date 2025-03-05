"use client";
import { Bot, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { model } from "@/lib/gemini";
import { cn } from "@/lib/utils";

export default function ChatBot() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; role: string }[]>([
    {
      text: "Hello, how can I help you today?",
      role: "assistant",
    },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const chatSession = model.startChat();

  const chatContext = `You are an AI-powered interview assistant. Your role is to help users with:
  - Interview preparation and common interview questions
  - Resume and cover letter advice
  - Job application processes
  - Company research tips
  - Career guidance
  Please provide concise, practical answers focused on these topics only in paragraph format.`;

  const handleSend = async () => {
    try {
      if (input.trim() === "") return;
      const userInput = input;
      setMessages((prev) => [...prev, { text: userInput, role: "user" }]);
      setInput("");
      setIsLoading(true);
      const prompt = `${chatContext}\n\nUser Question: ${userInput}\nPlease provide a helpful response:`;
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;
      if (response && response.text) {
        const responseText = response.text();
        setMessages((prev) => [
          ...prev,
          { text: responseText, role: "assistant" },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages([
        ...messages,
        {
          text: "I apologize, but I encountered an error. Please try asking your question again.",
          role: "assistant",
        },
      ]);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <Popover>
      <PopoverTrigger asChild className="fixed bottom-8 right-8">
        <Button
          size="lg"
          variant="secondary"
          className="w-14 h-14 [&_svg:not([class*='size-'])]:size-6"
        >
          <Bot />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-md h-[calc(100vh-14rem)] mr-8 bg-secondary text-secondary-foreground relative flex flex-col p-0">
        <div className="flex flex-col top-0 inset-x-0 bg-secondary p-4">
          <h1 className="text-lg font-bold">Interview Assistant</h1>
          <p className="text-sm text-foreground/60">
            Ask me about interview preparation, resumes, and job applications
          </p>
        </div>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto flex flex-col gap-4 p-4"
        >
          {messages.map((message) => (
            <Message key={message.text} message={message} />
          ))}
          {isLoading && (
            <div className="w-3/4 h-14 bg-background animate-pulse rounded-lg" />
          )}
        </div>
        <div className="w-full bg-background/60 text-accent-foreground bottom-0 inset-x-0 border-t flex items-center gap-4 p-4">
          <Input
            className="bg-accent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <Button variant="default" size="icon" onClick={handleSend}>
            <Send />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Message({ message }: { message: { text: string; role: string } }) {
  return (
    <div
      className={cn("w-full flex items-center justify-start", {
        "justify-end": message.role === "user",
      })}
    >
      <h1
        className={cn("rounded-lg p-3 text-sm max-w-3/4 bg-background/60", {
          "bg-primary text-primary-foreground": message.role === "assistant",
        })}
      >
        {message.text}
      </h1>
    </div>
  );
}
