"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-hWWl6knlnD0Jhlrn89vPnGHTf52tVW.svg"
              alt="Company Logo"
              width={50}
              height={50}
              priority
              className="rounded-full"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
