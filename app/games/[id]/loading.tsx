export default function GameDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="aspect-[16/10] animate-pulse rounded-lg bg-muted" />
        <div className="flex flex-col gap-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </main>
  );
}
