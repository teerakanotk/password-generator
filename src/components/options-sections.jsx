import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { CheckboxField } from "./checkbox-field";
import { SaveSettingField } from "./save-setting-field";

const options = [
  { id: "uppercase", label: "Uppercase" },
  { id: "lowercase", label: "Lowercase" },
  { id: "number", label: "Number" },
  { id: "symbol", label: "Symbol" },
  { id: "beginWithLetter", label: "Begin with letter" },
  { id: "excludeDuplicate", label: "Exclude duplicate characters" },
  { id: "excludeSimilar", label: "Exclude similar (iIl1oO0)" },
];

export function OptionsSection({ form }) {
  return (
    <div className="border rounded-md p-4">
      <FormField
        control={form.control}
        name="options"
        render={() => (
          <FormItem>
            <div className="grid md:grid-cols-2">
              {options.map((opt) => (
                <CheckboxField key={opt.id} form={form} option={opt} />
              ))}
              <SaveSettingField form={form} />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
