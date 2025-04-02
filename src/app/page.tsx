"use client";

import Image from "next/image";
import Header from "@/components/header";
import WeatherSearch from "@/components/weather-search";
import { useAppContext } from "@/context/app-context";

export default function Home() {
  const { theme,translations } = useAppContext();

  const bgClass = theme === "dark" ? "bg-dark" : "bg-sky-50";
  const textClass = theme === "dark" ? "text-white" : "text-black";
  return (
    <main className={`flex min-h-screen flex-col items-center p-4 md:p-24 transition-colors duration-300 ${bgClass}`}>
      <div className="w-full lg:max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Header />
        </div>
        <WeatherSearch />
      </div>
      <div className="grid items-center justify-items-center max-h-screen p-4 pb-10 gap-5 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className={`transition-colors duration-300 ${textClass}`}>{translations.made}</p>
        <div className="items-center sm:items-start">
          <Image
            className={theme === "dark" ? "invert" : ""}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
      </div>
    </main>
  );
}
