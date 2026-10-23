"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useI18n } from "@/lib/i18n-context";

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ value, onSearch }: SearchBarProps) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  // Reflect external changes (e.g. browser back/forward) into the input.
  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      if (!cancelled) setText(value);
    };
    void sync();
    return () => {
      cancelled = true;
    };
  }, [value]);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  const clear = () => {
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("search.placeholder")}
        aria-label={t("search.aria")}
        className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground"
      />
      {text ? (
        <button
          type="button"
          onClick={clear}
          aria-label={t("search.clear")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
