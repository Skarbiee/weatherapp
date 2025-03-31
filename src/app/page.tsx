import Image from "next/image";
import WeatherSearch from "../components/weather-search";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Météo",
  description: "Une application météo simple et efficace",
}

export default function Home() {
  return (
        <main className=" flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
    <div className=" w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 font-[family-name:var(--font-geist-sans)]">Application Météo</h1>

        {/* Nous utilisons notre composant de recherche météo ici */}
        <WeatherSearch />
      </div>
      <div className="grid items-center justify-items-center max-h-screen p-4 pb-10 gap-5 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p>Cette application a été réalisée avec</p>
        <div className="items-center sm:items-start">
          <Image
            className="dark:invert"
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
