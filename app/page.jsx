"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/lib/schemas/password";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { usePasswordGenerator } from "@/hooks/use-password-generator";

import { PasswordGeneratorForm } from "@/components/password-generator-form";
import { PasswordGeneratorResult } from "@/components/password-generator-result";

export default function HomePage() {
  const [formReady, setFormReady] = useState(false);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      length: 8,
      quantity: 1,
      requiredOptions: ["uppercase", "lowercase", "number", "symbol"],
      optionalOptions: [],
    },
  });

  // Load saved settings if available
  useFormPersistence(form, passwordSchema, () => setFormReady(true));

  const { generate, copySingle, copyAll, passwords, copiedIndex, displayRef } =
    usePasswordGenerator();

  useEffect(() => {
    if (!formReady) return;

    const submit = form.handleSubmit(generate);
    submit();
  }, [formReady, form, generate]);

  if (!formReady) return null;

  return (
    <main className="flex justify-center min-h-screen md:h-screen bg-accent">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-background flex-1">
        <h1 className="text-2xl font-bold text-center mb-6">
          Password Generator
        </h1>

        <PasswordGeneratorForm
          form={form}
          onGenerate={generate}
          onCopy={copySingle}
          onCopyAll={copyAll}
        />

        <PasswordGeneratorResult
          displayRef={displayRef}
          passwords={passwords}
          copiedIndex={copiedIndex}
        />
      </div>
    </main>
  );
}
