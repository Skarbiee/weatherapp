import Image from "next/image";
import Header from "@/components/header";
import WeatherSearch from "@/components/weather-search";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Header />
        </div>
        <WeatherSearch />
      </div>
      <div className="grid items-center justify-items-center max-h-screen p-4 pb-10 gap-5 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p>Made with</p>
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
