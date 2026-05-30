import React from "react";
import { FlipWords } from "@/src/components/ui/flip-words";
import { cn } from "@/lib/utils";

const defaultWords = [
  "Designs.",
  "Mockups.",
  "Prototypes.",
  "Wireframes.",
  "Screens.",
  "Layouts.",
];

type FlipWordsDemoProps = {
  words?: string[];
  className?: string;
  duration?: number;
};

export default function FlipWordsDemo({
  words = defaultWords,
  className,
  duration,
}: FlipWordsDemoProps) {
  return (
    <FlipWords
      words={words}
      duration={duration}
      className={cn(
        "inline-block relative text-inherit font-inherit text-center px-1",
        className
      )}
    />
  );
}
