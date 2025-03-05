"use client";
import Link from "next/link";
import { useState } from "react";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "gradient-bg-dark text-white"
          : "gradient-bg-light text-gray-800"
      }`}
    >
      <nav
        className={`fixed w-full top-0 z-50 transition-colors duration-300 ${
          darkMode ? "bg-gray-900/80" : "bg-white/80"
        }`}
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-indigo-500">AI</span>
                <span className={darkMode ? "text-white" : "text-gray-800"}>
                  mpact
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <Link
                href="#"
                className="hover:text-indigo-500 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#"
                className="hover:text-indigo-500 transition-colors"
              >
                About
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {!darkMode ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="h-full w-full pt-24">
        <div className="flex flex-col items-center justify-center py-28 gap-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide max-w-5xl leading-relaxed select-none text-center">
            Master Your Interviews with
            <br />
            <span className="text-indigo-500">AI</span>
            <span>mpact</span> - Your Personal Interview Coach 🚀
          </h1>

          <p className="text-xl opacity-80 text-center max-w-2xl">
            Transform your interview preparation with AI-powered feedback,
            real-time coaching, and personalized strategies.
          </p>

          <div className="flex items-center justify-center">
            <Link
              href="/dashboard"
              className="hover-lift inline-flex items-center justify-center rounded-full text-lg font-semibold py-4 px-12 bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <footer
        className={`border-t transition-colors duration-300 ${
          darkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center opacity-75">
            <p>© 2025 AImpact. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
