"use client";

import { requiredOptions, optionalOptions } from "@/lib/constants/options";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function PasswordGeneratorForm({ form, onGenerate, onCopy, onCopyAll }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Password length</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Options</Label>
          <div className="grid md:grid-cols-2 gap-1 border rounded-md p-4">
            <FormField
              control={form.control}
              name="requiredOptions"
              render={({ field }) => (
                <>
                  {requiredOptions.map((item) => (
                    <FormItem key={item.id} className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(item.id)}
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
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </>
              )}
            />

            <FormField
              control={form.control}
              name="optionalOptions"
              render={({ field }) => (
                <>
                  {optionalOptions.map((item) => (
                    <FormItem key={item.id} className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(item.id)}
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
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </>
              )}
            />
          </div>

          {form.formState.errors?.requiredOptions && (
            <FormMessage>
              {form.formState.errors?.requiredOptions.message}
            </FormMessage>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 *:cursor-pointer">
          <Button type="submit">Generate</Button>
          <Button type="button" variant="outline" onClick={onCopy}>
            Copy
          </Button>
          <Button type="button" variant="outline" onClick={onCopyAll}>
            Copy All
          </Button>
        </div>
      </form>
    </Form>
  );
}
