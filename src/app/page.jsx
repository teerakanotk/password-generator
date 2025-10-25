"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingSchema } from "@/lib/zod";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { genPass } from "@/lib/genpass";
import { GenerateForm } from "@/components/generate-form";
import { PasswordList } from "@/components/password-list";

export default function HomePage() {
  const [formReady, setFormReady] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(0);
  const passwordRefs = useRef([]);
  const allPasswordsRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      length: 8,
      quantity: 1,
      options: ["uppercase", "lowercase", "number", "symbol"],
      saveSetting: false,
    },
  });

  useFormPersistence(form, settingSchema, () => {
    setFormReady(true);
  });

  useEffect(() => {
    if (formReady) {
      form.handleSubmit(handleGenerate)();
    }
  }, [formReady]); // Dependency array, the effect will rerun if 'formReady' changes

  if (!formReady) return null;

  /** ---- Handlers ---- */
  function handleGenerate(values) {
    const { length, quantity, options } = values;

    const generated = Array.from({ length: quantity }, () =>
      genPass(Object.fromEntries(options.map((opt) => [opt, true])), length)
    );

    setPasswords(generated);
    setCopiedIndex(0);
    window.getSelection()?.removeAllRanges();

    if (allPasswordsRef.current) allPasswordsRef.current.scrollTop = 0;
  }

  function copyToClipboard(text, el) {
    if (!text) return;
    navigator.clipboard.writeText(text);

    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  form.handleCopySinglePassword = () => {
    const text = passwords[copiedIndex];
    const el = passwordRefs.current[copiedIndex];
    if (!text || !el) return;

    copyToClipboard(text, el);
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setCopiedIndex((prev) => (prev + 1) % passwords.length);
  };

  form.handleCopyAllPasswords = () => {
    if (!passwords.length) return;
    const text = passwords.join("\n");
    copyToClipboard(text, allPasswordsRef.current ?? undefined);
    if (allPasswordsRef.current) allPasswordsRef.current.scrollTop = 0;
  };

  return (
    <div className="flex min-h-screen md:h-screen bg-accent-foreground/5">
      <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto gap-6 p-6 md:p-8 bg-background">
        <h1 className="text-2xl font-bold text-center">Password Generator</h1>

        <GenerateForm form={form} onSubmit={handleGenerate} />

        <PasswordList
          passwords={passwords}
          passwordRefs={passwordRefs}
          allPasswordsRef={allPasswordsRef}
        />
      </div>
    </div>
  );
}
