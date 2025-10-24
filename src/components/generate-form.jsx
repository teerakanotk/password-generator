"use client";

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
  { id: "uppercase", label: "Uppercase" },
  { id: "lowercase", label: "Lowercase" },
  { id: "number", label: "Number" },
  { id: "symbol", label: "Symbol" },
  { id: "beginWithLetter", label: "Begin with letter" },
  { id: "excludeDuplicate", label: "Exclude duplicate characters" },
  { id: "excludeSimilar", label: "Exclude similar (iIl1oO0)" },
];

export function GenerateForm({ form, onSubmit }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Length */}
        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">
                Password Length (4-32)
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">Quantity (1-500)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options */}
        <div className="border rounded-md p-4">
          <FormField
            control={form.control}
            name="options"
            render={() => (
              <FormItem>
                <FormItem className="grid md:grid-cols-2">
                  {options.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="options"
                      render={({ field }) => {
                        return (
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
                        );
                      }}
                    />
                  ))}

                  <FormField
                    control={form.control}
                    name="saveSetting"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(!!checked)
                            }
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Save Setting
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-1">
          <Button type="submit" variant="default" className="cursor-pointer">
            Generate
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={form.handleCopySinglePassword}
          >
            Copy
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={form.handleCopyAllPasswords}
          >
            Copy All
          </Button>
        </div>
      </form>
    </Form>
  );
}
