"use client";

import { useEffect, useState, type RefObject } from "react";

/** Parse any CSS color string (hex or rgb()) into rgba with the given alpha. */
export function toRgba(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const match = /(\d+),\s*(\d+),\s*(\d+)/.exec(color);
  if (match) {
    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
  }
  return color;
}

export type ThemeColors = {
  primary: string;
  tooltipBg: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  cursorFill: string;
};

export function useThemeColors(
  ref: RefObject<HTMLDivElement | null>,
): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#1d6ee3",
    tooltipBg: "rgba(15, 17, 23, 0.95)",
    textColor: "#e4e4e7",
    mutedColor: "#71717a",
    borderColor: "rgba(255,255,255,0.1)",
    cursorFill: "rgba(255,255,255,0.03)",
  });

  useEffect(() => {
    if (!ref.current) return;
    const styles = getComputedStyle(ref.current);

    const primary = styles.getPropertyValue("--primary").trim() || "#1d6ee3";
    const bg = styles.getPropertyValue("--bg").trim();
    const border = styles.getPropertyValue("--border").trim();
    const heading = styles.getPropertyValue("--text-heading").trim();
    const muted = styles.getPropertyValue("--text-muted").trim();

    const isLightText =
      heading.startsWith("#e") ||
      heading.startsWith("#f") ||
      heading.startsWith("rgb(2");

    setColors({
      primary,
      tooltipBg: bg ? toRgba(bg, 0.95) : "rgba(15, 17, 23, 0.95)",
      textColor: heading || "#e4e4e7",
      mutedColor: muted || "#71717a",
      borderColor: border || "rgba(255,255,255,0.1)",
      cursorFill: isLightText
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.03)",
    });
  }, [ref]);

  return colors;
}
