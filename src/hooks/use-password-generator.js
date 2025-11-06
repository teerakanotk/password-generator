import { useState, useRef, useCallback, useEffect } from "react";
import { generatePassword } from "@/lib/generate-password";

export function usePasswordGenerator() {
  const [passwords, setPasswords] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const displayRef = useRef(null);

  // Scroll to top of password list
  const scrollToTop = useCallback(() => {
    displayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Scroll to specific password index
  const scrollToIndex = useCallback((index) => {
    const el = displayRef.current?.children?.[index];
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  // ✅ Generate passwords from form data
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

  // Copy one password at a time
  const copySingle = useCallback(() => {
    if (!passwords.length) return;

    const nextIndex =
      copiedIndex === null || copiedIndex === "all"
        ? 0
        : (copiedIndex + 1) % passwords.length;

    navigator.clipboard.writeText(passwords[nextIndex]);
    setCopiedIndex(nextIndex);
  }, [passwords, copiedIndex]);

  // Scroll to copied password
  useEffect(() => {
    if (typeof copiedIndex === "number") {
      scrollToIndex(copiedIndex);
    }
  }, [copiedIndex, scrollToIndex]);

  // Copy all passwords
  const copyAll = useCallback(() => {
    if (!passwords.length) return;

    navigator.clipboard.writeText(passwords.join("\n"));
    setCopiedIndex("all");
    scrollToTop();
  }, [passwords, scrollToTop]);

  return {
    passwords,
    copiedIndex,
    displayRef,
    generate,
    copySingle,
    copyAll,
  };
}
