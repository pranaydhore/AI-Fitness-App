"use client";

import { Moon, Sun, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Detect active theme
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="app-header sticky top-0 z-50 w-full border-b backdrop-blur"
      style={{
        background:
          currentTheme === "dark"
            ? "rgba(15, 23, 42, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
        borderColor: currentTheme === "dark" ? "#1f2937" : "#e5e7eb",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        className="container flex h-16 items-center justify-between px-4"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Dumbbell
              className="h-8 w-8"
              style={{
                color: currentTheme === "dark" ? "#8b5cf6" : "#667eea",
                transition: "color 0.3s ease",
              }}
            />
          </motion.div>
          <div>
            <h1
              className="text-xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  currentTheme === "dark"
                    ? "linear-gradient(to right, #a78bfa, #ec4899)"
                    : "linear-gradient(to right, #7c3aed, #ec4899)",
              }}
            >
              AI Fitness Coach
            </h1>
            <p
                className="text-xs"
                style={{
                  color: currentTheme === "dark" ? "#f1f5f9" : "#111827", // ✅ White in dark mode, black in light mode
                  transition: "color 0.3s ease",
                }}
              >
                Your Personal AI Trainer
              </p>

          </div>
        </div>

        {/* Right: Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setTheme(currentTheme === "light" ? "dark" : "light")
          }
          aria-label="Toggle theme"
          style={{
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            border: `2px solid ${
              currentTheme === "dark" ? "#a78bfa" : "#7c3aed"
            }`,
            background: "transparent",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {currentTheme === "light" ? (
            <Moon size={20} style={{ color: "#7c3aed" }} />
          ) : (
            <Sun size={20} style={{ color: "#a78bfa" }} />
          )}
        </motion.button>
      </div>
    </motion.header>
  );
}
