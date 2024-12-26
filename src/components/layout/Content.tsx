"use client";
import { Suspense } from "react";
import NavigationSync from "@/components/layout/NavigationSync";

export const Content = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className="pointer-events-none absolute top-0 right-0 w-full h-full"
      style={{
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        perspective: 1000,
        willChange: "transform",
      }}
    >
      <div
        style={{
          marginLeft: "50vw",
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          perspective: 1000,
          willChange: "transform",
        }}
        className="pointer-events-auto w-1/2 md:w-1/2 hidden md:block"
      >
        <Suspense fallback={null}>
          <NavigationSync />
        </Suspense>
        <Suspense fallback={null}>
        {children}
        </Suspense>
      </div>
    </div>
  );
};
