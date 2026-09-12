import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  CheckCircle2,
  Clock,
  Grid3X3,
  MessageCircle,
  Shield,
} from "lucide-react";

export default function HomeComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative flex min-h-screen items-center overflow-hidden bg-[#0d1120] pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#1c2242_0%,#12172B_55%,#0d1120_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-b from-transparent via-[#12172B]/25 to-background" />
        <div className="relative z-3 w-full px-5 pt-12 pb-24 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-295 text-center">
            <span className="mb-7 inline-flex rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/12 px-3.5 py-1.5 font-mono text-xs tracking-wider text-[#A480F2] uppercase">
              Deterministic matching
            </span>
            <h1 className="mx-auto max-w-225 text-[clamp(38px,6vw,74px)] leading-[1.04] font-bold tracking-[-0.03em] text-white">
              Great Ideas Need the Right{" "}
              <span className="bg-linear-to-r from-[#A480F2] to-[#6C63D6] bg-clip-text text-transparent">
                Co-Founder.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-150 text-[clamp(16px,2vw,19px)] text-white/68">
              FounderLink matches your profile against real, specific co-founder
              roles. See exactly why you are a strong fit before you say hello.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                nativeButton={false}
                size="lg"
                className="bg-linear-to-r from-[#4338CA] to-[#7C3AED] px-7 py-3.5 text-base text-white shadow-lg shadow-[#7C3AED]/35"
                render={<Link href="/signup" />}
              >
                Create your profile
              </Button>
              <Button
                nativeButton={false}
                size="lg"
                variant="ghost"
                className="border border-white/18 px-7 py-3.5 text-base text-white/85 hover:bg-white/10 hover:text-white"
                render={<a href="#how" />}
              >
                See how matching works
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-10 sm:gap-14">
              {[
                ["4", "scoring factors"],
                ["100%", "explainable scores"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="font-mono text-[28px] font-medium text-white">
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
