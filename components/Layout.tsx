"use client";

import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {



  return (
    <div className="flex h-screen overflow-hidden bg-white text-black">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 bg-white text-black scrollable-element">
          {children}
        </main>
      </div>
    </div>
  );
}
