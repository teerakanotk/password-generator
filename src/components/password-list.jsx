"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function PasswordList({ passwords, passwordRefs, allPasswordsRef }) {
  if (!passwords.length) return null;

  return (
    <ScrollArea
      ref={allPasswordsRef}
      className="min-h-[58px] max-h-[30vh] md:max-h-screen border rounded-md overflow-auto whitespace-nowrap"
    >
      <div className="p-4">
        {passwords.map((item, index) => (
          <div key={index} ref={(el) => (passwordRefs.current[index] = el)}>
            {item}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
