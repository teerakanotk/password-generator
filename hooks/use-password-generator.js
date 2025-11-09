import { useState, useRef, useCallback, useEffect } from "react";
import { generatePassword, PasswordOptions } from "@/lib/generate-password";
import { copyToClipboard } from "@/lib/utils";

export function usePasswordGenerator() {
  const [passwords, setPasswords] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const displayRef = useRef(null);

  const scrollToTop = useCallback(() => {
    displayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToIndex = useCallback((index) => {
    const el = displayRef.current?.children?.[index];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const generate = useCallback(
    ({ length, quantity, requiredOptions, optionalOptions }) => {
      const filteredOptional = optionalOptions.filter(
        (opt) => opt !== "saveSetting"
      );
      const options = [...requiredOptions, ...filteredOptional];
      const optionMap = Object.fromEntries(options.map((opt) => [opt, true]));

      const generated = Array.from({ length: quantity }, () =>
        generatePassword(optionMap, length)
      );

      setPasswords(generated);
      setCopiedIndex(null);
      scrollToTop();
    },
    [scrollToTop]
  );

  // Copy one password
  const copySingle = useCallback(async () => {
    if (!passwords.length) return;

    const nextIndex =
      copiedIndex === null || copiedIndex === "all"
        ? 0
        : (copiedIndex + 1) % passwords.length;

    const success = await copyToClipboard(passwords[nextIndex]);
    if (success) setCopiedIndex(nextIndex);
  }, [passwords, copiedIndex]);

  // Copy all passwords
  const copyAll = useCallback(async () => {
    if (!passwords.length) return;

    const success = await copyToClipboard(passwords.join("\n"));
    if (success) {
      setCopiedIndex("all");
      scrollToTop();
    }
  }, [passwords, scrollToTop]);

  useEffect(() => {
    if (typeof copiedIndex === "number") {
      scrollToIndex(copiedIndex);
    }
  }, [copiedIndex, scrollToIndex]);

  return {
    passwords,
    copiedIndex,
    displayRef,
    generate,
    copySingle,
    copyAll,
  };
}
