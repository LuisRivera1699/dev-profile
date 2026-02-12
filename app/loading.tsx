import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b h-14" />
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container mx-auto max-w-3xl px-6 text-center">
            <Skeleton className="mx-auto h-12 w-3/4" />
            <Skeleton className="mx-auto mt-4 h-6 w-1/2" />
            <Skeleton className="mx-auto mt-6 h-20 w-full" />
            <div className="mt-10 flex justify-center gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </section>
        <section className="border-b py-20">
          <div className="container mx-auto max-w-3xl px-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="mt-6 h-40 w-full" />
          </div>
        </section>
      </main>
    </div>
  );
}
