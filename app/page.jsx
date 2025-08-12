"use client";

import { useState, useEffect } from "react";
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

const STORAGE_KEY = process.env.STORAGE_KEY;

export default function HomePage() {
  const [formReady, setFormReady] = useState(false);
  const [passwords, setPasswords] = useState([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      length: 8,
      quantity: 1,
      options: ["uppercase", "lowercase", "numbers", "symbols"],
      saveSetting: false,
    },
  });

  function onSubmit(data) {
    const { length, quantity, options } = data;
    const generated = Array.from({ length: quantity }, () =>
      genpass(options, length)
    );

    setPasswords(generated);
  }

  // use for save and loading save setting from localstorage
  useFormPersistence(form, FormSchema, STORAGE_KEY, () => {
    setFormReady(true);
  });

  // trigger password generate button once when reloading page
  useEffect(() => {
    if (formReady) {
      form.handleSubmit(onSubmit)(); // trigger generate
    }
  }, [formReady]);

  // prevent rendering until form ready
  if (!formReady) return null;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h1 className="flex items-center justify-center text-2xl font-bold mb-6">
        Password Generator
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          {/* length */}
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

          {/* quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-1">
            {/* checkbox group */}
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <>
                  {options.map((item) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-center gap-2"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                );
                          }}
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

            {/* save setting */}
            <FormField
              control={form.control}
              name="saveSetting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
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

          {/* button group */}
          <div className="grid grid-cols-3 gap-2">
            <Button type="submit" className="cursor-pointer">
              Generate
            </Button>
            <Button type="button" className="cursor-pointer">
              Copy
            </Button>
            <Button type="button" className="cursor-pointer">
              Copy All
            </Button>
          </div>
        </form>
      </Form>

      {/* display password */}
      {passwords.length > 0 && (
        <div className="max-h-[40vh] md:max-h-[60vh] lg:max-h-[70vh] overflow-auto p-4 border rounded-md">
          {passwords.map((item, index) => (
            <div key={index} className="font-mono text-sm">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
