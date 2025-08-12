"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useFormPersistence } from "@/hooks/use-form-persistence";
import { genpass } from "@/utils/genpass";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = process.env.STORAGE_KEY;

const options = [
  { id: "uppercase", label: "Uppercase (A-Z)" },
  { id: "lowercase", label: "Lowercase (a-z)" },
  { id: "numbers", label: "Numbers (0-9)" },
  { id: "symbols", label: "Symbols (@#)" },
  { id: "beginWithLetter", label: "Begin with letter" },
  { id: "noDuplicated", label: "No duplicated characters" },
  { id: "noSimilar", label: "No similar (iIl1oO0)" },
];

const FormSchema = z.object({
  length: z.coerce
    .number()
    .min(4, "Password length must be at least 4 characters")
    .max(32, "Password length must not exceed 32 characters"),
  quantity: z.coerce
    .number()
    .min(1, "You must generate at least 1 password")
    .max(500, "You can generate up to 500 passwords"),
  options: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Please select at least one character type",
  }),
  saveSetting: z.boolean().optional(),
});

export default function HomePage() {
  const [formReady, setFormReady] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(0);

  const passwordRefs = useRef([]);
  const allPasswordsRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      length: 8,
      quantity: 1,
      options: ["uppercase", "lowercase", "numbers", "symbols"],
      saveSetting: false,
    },
  });

  useFormPersistence(form, FormSchema, STORAGE_KEY, () => {
    setFormReady(true);
  });

  useEffect(() => {
    if (formReady) form.handleSubmit(handleGenerate)();
  }, [formReady]);

  if (!formReady) return null;

  const handleGenerate = (data) => {
    const { length, quantity, options } = data;
    const generated = Array.from({ length: quantity }, () =>
      genpass(options, length)
    );

    setPasswords(generated);
    setCopiedIndex(0);
    window.getSelection()?.removeAllRanges();
  };

  const copyToClipboard = (text, el) => {
    if (!text) return;

    navigator.clipboard.writeText(text);

    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleCopy = () => {
    const text = passwords[copiedIndex];
    const el = passwordRefs.current[copiedIndex];
    copyToClipboard(text, el);

    const nextIndex = (copiedIndex + 1) % passwords.length;
    setCopiedIndex(nextIndex);
  };

  const handleCopyAll = () => {
    const text = passwords.join("\n");
    copyToClipboard(text, allPasswordsRef.current ?? undefined);
  };

  return (
    <div className="max-w-lg mx-auto p-4 py-12 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Password Generator
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleGenerate)}
          className="grid gap-4"
        >
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Length</FormLabel>
                <FormControl>
                  <Input type="number" min={4} max={32} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={500} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-1">
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <>
                  {options.map((item) => (
                    <FormItem key={item.id} className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) =>
                            checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(
                                  field.value.filter((v) => v !== item.id)
                                )
                          }
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </>
              )}
            />

            <FormField
              control={form.control}
              name="saveSetting"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Save Setting
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button type="submit" className="cursor-pointer">
              Generate
            </Button>
            <Button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer"
            >
              Copy
            </Button>
            <Button
              type="button"
              onClick={handleCopyAll}
              className="cursor-pointer"
            >
              Copy All
            </Button>
          </div>
        </form>
      </Form>

      {passwords.length > 0 && (
        <div
          ref={allPasswordsRef}
          className="max-h-[40vh] overflow-auto p-4 border rounded-md"
        >
          {passwords.map((item, index) => (
            <div key={index} ref={(el) => (passwordRefs.current[index] = el)}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
