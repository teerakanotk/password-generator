import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxField({ form, option }) {
  return (
    <FormField
      control={form.control}
      name="options"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-2">
          <FormControl>
            <Checkbox
              checked={field.value?.includes(option.id)}
              onCheckedChange={(checked) =>
                checked
                  ? field.onChange([...field.value, option.id])
                  : field.onChange(field.value?.filter((v) => v !== option.id))
              }
              className="cursor-pointer"
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
        </FormItem>
      )}
    />
  );
}
