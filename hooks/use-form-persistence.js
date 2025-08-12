import { useEffect } from "react";

export function useFormPersistence(form, schema, storageKey, onReady) {
  // Load saved settings on mount
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      onReady();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const result = schema.safeParse(parsed);
      if (result.success) {
        form.reset(result.data);
      }
    } finally {
      onReady();
    }
  }, [form, schema, storageKey]);

  // Watch and persist settings
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.saveSetting) {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } else {
        localStorage.removeItem(storageKey);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, storageKey]);
}
