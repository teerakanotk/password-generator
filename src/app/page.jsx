"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { settingSchema } from "@/lib/schemas";
import { generatePassword } from "@/lib/password";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NumberField } from "@/components/number-field";
import { OptionsSection } from "@/components/options-sections";

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

  useFormPersistence(form, settingSchema, () => setFormReady(true));

  const handleGenerate = useCallback((values) => {
    const { length, quantity, options } = values;
    const generated = Array.from({ length: quantity }, () =>
      generatePassword(
        Object.fromEntries(options.map((opt) => [opt, true])),
        length
      )
    );

    setPasswords(generated);
    setCopiedIndex(0);
    window.getSelection()?.removeAllRanges();
    allPasswordsRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const copyToClipboard = useCallback((text, element) => {
    if (!text) return;
    navigator.clipboard.writeText(text);

    if (element) {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  const handleCopySinglePassword = useCallback(() => {
    const text = passwords[copiedIndex];
    const el = passwordRefs.current[copiedIndex];
    if (!text || !el) return;

    copyToClipboard(text, el);
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setCopiedIndex((prev) => (prev + 1) % passwords.length);
  }, [passwords, copiedIndex, copyToClipboard]);

  const handleCopyAllPasswords = useCallback(() => {
    if (!passwords.length) return;
    const text = passwords.join("\n");
    copyToClipboard(text, allPasswordsRef.current);
    allPasswordsRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [passwords, copyToClipboard]);

  useEffect(() => {
    if (formReady) form.handleSubmit(handleGenerate)();
  }, [formReady, form, handleGenerate]);

  if (!formReady) return null;

  return (
    <div className="flex min-h-screen md:h-screen bg-accent-foreground/5">
      <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto gap-6 p-6 md:p-8 bg-background">
        <h1 className="text-2xl font-bold text-center">Password Generator</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGenerate)}
            className="space-y-6 w-full"
          >
            <NumberField
              form={form}
              name="length"
              label="Password Length (4-32)"
            />
            <NumberField form={form} name="quantity" label="Quantity (1-500)" />
            <OptionsSection form={form} />

            <div className="grid grid-cols-3 gap-1">
              <Button type="submit" className="cursor-pointer">
                Generate
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCopySinglePassword}
                className="cursor-pointer"
              >
                Copy
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyAllPasswords}
                className="cursor-pointer"
              >
                Copy All
              </Button>
            </div>
          </form>
        </Form>

        <ScrollArea
          ref={allPasswordsRef}
          className="min-h-[58px] max-h-[30vh] md:max-h-screen border rounded-md overflow-auto whitespace-nowrap"
        >
          <div className="p-4 space-y-1">
            {passwords.map((pw, i) => (
              <div key={i} ref={(el) => (passwordRefs.current[i] = el)}>
                {pw}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
