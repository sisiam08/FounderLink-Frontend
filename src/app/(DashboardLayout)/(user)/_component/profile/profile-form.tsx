"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { Upload, X } from "lucide-react";
import { z } from "zod";


import { envConfig } from "@/env";
import type { IProfileFormValues, ProfileRole } from "@/interfaces";

import { useRouter } from "next/navigation";

const API_ORIGIN = new URL(envConfig.NEXT_PUBLIC_API_URL).origin;

const urlSchema = z
  .string()
  .refine((v) => v === "" || /^https?:\/\//.test(v), "Must be a valid URL");

const profileSchema = z.object({
  role: z.string().min(1, "Select your area of expertise"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interestedIndustries: z
    .array(z.string())
    .min(1, "Select at least one industry"),
  availableWeeklyCommitment: z
    .number()
    .min(1, "Must be enter your time commitment per week")
    .max(80, "Max 80 hours per week"),
  bio: z.string().max(2000, "Keep it under 2000 characters"),
  portfolioUrl: urlSchema,
  githubUrl: urlSchema,
  linkedinUrl: urlSchema,
  location: z.string(),
  photoUrl: z.string().nullable(),
});

export default function ProfileForm({
  initial,
  submitLabel,
  onSuccess,
}: {
  initial?: Partial<IProfileFormValues>;
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial;


  return (
  );
}
