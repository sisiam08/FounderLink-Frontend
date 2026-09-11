"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { Upload, X } from "lucide-react";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/shared/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  INDUSTRY_OPTIONS,
  PROFILE_ROLE_LABELS,
  PROFILE_ROLES,
  SKILL_OPTIONS,
} from "@/constants/options";
import { envConfig } from "@/env";
import type { IProfileFormValues, ProfileRole } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createProfile,
  updateProfile,
  uploadProfilePhoto,
} from "@/services/profile.service";
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

  const form = useForm({
    defaultValues: {
      role: initial?.role ?? "",
      skills: initial?.skills ?? [],
      interestedIndustries: initial?.interestedIndustries ?? [],
      availableWeeklyCommitment: initial?.availableWeeklyCommitment ?? 0,
      bio: initial?.bio ?? "",
      portfolioUrl: initial?.portfolioUrl ?? "",
      githubUrl: initial?.githubUrl ?? "",
      linkedinUrl: initial?.linkedinUrl ?? "",
      location: initial?.location ?? "",
      photoUrl: initial?.photoUrl ?? null,
    },
    validators: { onChange: profileSchema },
    onSubmit: async ({ value }) => {
      const profileData = {
        role: value.role as ProfileRole,
        skills: value.skills,
        interestedIndustries: value.interestedIndustries,
        availableWeeklyCommitment: value.availableWeeklyCommitment,
        bio: value.bio || undefined,
        portfolioUrl: value.portfolioUrl || undefined,
        githubUrl: value.githubUrl || undefined,
        linkedinUrl: value.linkedinUrl || undefined,
        location: value.location || undefined,
        photoUrl: value.photoUrl,
      };

      try {
        if (isEdit) {
          await updateProfile(profileData);
          toast.add({ type: "success", description: "Profile updated" });
          onSuccess?.();
        } else {
          await createProfile(profileData);
          toast.add({
            type: "success",
            description: "Profile created successfully",
          });
          router.push("/requirements/browse");
        }
      } catch (error) {
        toast.add({ type: "error", description: getApiErrorMessage(error) });
      }
    },
  });


  return (
  );
}
