"use client";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function PasswordGeneratorResult({
  displayRef,
  passwords,
  copiedIndex,
}) {
  return (
    <div className="flex-1 mt-6 min-h-0 max-h-screen">
      <ScrollArea className="h-full border rounded-md shadow-xs">
        <div ref={displayRef} className="p-4 space-y-0.5">
          {passwords.map((item, index) => (
            <div
              key={index}
              className={cn(
                (copiedIndex === "all" || index === copiedIndex) && "bg-accent"
              )}
            >
              {item}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
