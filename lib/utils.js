import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text) {
  // Clipboard API only works in secure contexts (HTTPS or localhost)
  const canUseClipboard =
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    window.isSecureContext;

  try {
    if (canUseClipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback: use a temporary <textarea> element
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.warn("Clipboard copy failed:", err);
    return false;
  }
}
