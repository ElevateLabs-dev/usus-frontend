"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div
        className="
          h-10
          w-10
          shrink-0
          rounded-full
          border
          border-[var(--usus-border)]
          bg-[var(--usus-surface)]
        "
      />
    );
  }

  const isDark = theme === "dark";

  function handleThemeChange() {
    if (switching) {
      return;
    }

    setSwitching(true);

    document.documentElement.classList.add(
      "usus-theme-transition",
    );

    setTheme(isDark ? "light" : "dark");

    window.setTimeout(() => {
      document.documentElement.classList.remove(
        "usus-theme-transition",
      );

      setSwitching(false);
    }, 250);
  }

  return (
    <button
      type="button"
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      aria-pressed={isDark}
      onClick={handleThemeChange}
      disabled={switching}
      className="
        relative
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        text-[var(--usus-text)]
        shadow-sm
        transition-all
        duration-200
        ease-out
        hover:-translate-y-0.5
        hover:border-[var(--usus-primary)]
        hover:bg-[var(--usus-sidebar-hover)]
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-[var(--usus-primary)]
        focus:ring-offset-2
        focus:ring-offset-[var(--usus-header)]
        disabled:pointer-events-none
      "
    >
      <span
        className={`
          absolute
          inset-0
          rounded-full
          bg-[var(--usus-primary)]
          transition-opacity
          duration-200
          ${
            switching
              ? "opacity-10"
              : "opacity-0"
          }
        `}
      />

      <span
        className={`
          relative
          flex
          items-center
          justify-center
          transition-all
          duration-200
          ease-out
          ${
            switching
              ? "scale-75 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }
        `}
      >
        {isDark ? (
          <Sun
            size={18}
            strokeWidth={1.8}
          />
        ) : (
          <Moon
            size={18}
            strokeWidth={1.8}
          />
        )}
      </span>
    </button>
  );
};