export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen">
      <main className="flex flex-col items-center gap-6 text-center p-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Financial Tracker
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
          Track your finances, investments, and spending in one place.
        </p>
      </main>
    </div>
  );
}
