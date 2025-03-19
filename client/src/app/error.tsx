"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, something went wrong!
        </h1>
        <p className="mt-4 text-muted-foreground">
          We&apos;re sorry, but an unexpected error has occurred. Please try
          again later or contact support if the issue persists.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-4 text-muted-foreground">{JSON.stringify(error)}</p>
        )}
        {process.env.NODE_ENV === "development" && (
          <p className="mt-4 text-muted-foreground">{error?.message}</p>
        )}
        <div className="mt-6 flex gap-2 items-center justify-center">
          <Link href="/dashboard" className={buttonVariants()}>
            Go to Homepage
          </Link>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
