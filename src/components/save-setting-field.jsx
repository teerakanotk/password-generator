import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export function SaveSettingField({ form }) {
  return (
    <FormField
      control={form.control}
      name="saveSetting"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              className="cursor-pointer"
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">Save Setting</FormLabel>
        </FormItem>
      )}
    />
  );
}
