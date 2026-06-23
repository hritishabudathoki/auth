"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "@/lib/api/auth";
import type { User } from "@/lib/api/auth";
import { useAuth } from "@/lib/providers/auth-provider";
import {
  profileUpdateSchema,
  type ProfileUpdateFormValues,
} from "./profile-schema";

interface ProfileUpdateFormProps {
  initialUser: User;
}

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

function getProfileImageUrl(profileImage?: string) {
  if (!profileImage) {
    return null;
  }

  if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
    return profileImage;
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

  return `${apiBaseUrl}${profileImage}`;
}

export default function ProfileUpdateForm({
  initialUser,
}: ProfileUpdateFormProps) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const profileImagePreview = useMemo(() => {
    return previewUrl ?? getProfileImageUrl(initialUser.profileImage);
  }, [initialUser.profileImage, previewUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: initialUser.firstName,
      lastName: initialUser.lastName,
      email: initialUser.email,
      username: initialUser.username,
    },
  });

  const onSubmit = (values: ProfileUpdateFormValues) => {
    setServerMessage(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("username", values.username);

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      try {
        const result = await updateUser(formData);

        if (!result.success) {
          setServerMessage({ type: "error", text: result.message });
          return;
        }

        if (result.data) {
          setUser(result.data as User);
        }

        setServerMessage({ type: "success", text: result.message });
        setSelectedImage(null);
        setPreviewUrl(null);
        router.refresh();
      } catch (error) {
        setServerMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to update user",
        });
        return;
      }
    });
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setServerMessage(null);

    if (!file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedImage(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedImage(null);
      setPreviewUrl(null);
      event.target.value = "";
      setServerMessage({
        type: "error",
        text: "Please upload a valid image file.",
      });
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedImage(null);
      setPreviewUrl(null);
      event.target.value = "";
      setServerMessage({
        type: "error",
        text: "Image must be 5 MB or smaller.",
      });
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(nextPreviewUrl);
  };

  return (
    <div className="border border-hairline bg-surface-card p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-hairline bg-canvas">
          {profileImagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileImagePreview}
              alt={`${initialUser.firstName} ${initialUser.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl uppercase tracking-[1.5px] text-on-dark">
              {initialUser.firstName.slice(0, 1)}
              {initialUser.lastName.slice(0, 1)}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[1.5px] text-muted">
            Profile image
          </p>
          <p className="mt-2 max-w-md text-sm font-light text-body">
            Upload a new image to update your profile. Only image files up to 5
            MB are accepted.
          </p>
        </div>
      </div>

      {serverMessage && (
        <div
          className={`mb-6 border px-4 py-3 text-sm ${
            serverMessage.type === "success"
              ? "border-m-blue-light bg-m-blue-dark/20 text-on-dark"
              : "border-m-red bg-m-red/10 text-m-red"
          }`}
        >
          {serverMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-body file:mr-4 file:border-0 file:bg-on-dark file:px-4 file:py-3 file:text-xs file:uppercase file:tracking-[1.5px] file:text-canvas"
            onChange={handleProfileImageChange}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
              First Name
            </label>
            <input
              type="text"
              className="h-12 w-full border border-hairline bg-canvas px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="mt-1.5 text-sm text-m-red">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
              Last Name
            </label>
            <input
              type="text"
              className="h-12 w-full border border-hairline bg-canvas px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="mt-1.5 text-sm text-m-red">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
              Email
            </label>
            <input
              type="email"
              className="h-12 w-full border border-hairline bg-canvas px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-m-red">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
              Username
            </label>
            <input
              type="text"
              className="h-12 w-full border border-hairline bg-canvas px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
              {...register("username")}
            />
            {errors.username && (
              <p className="mt-1.5 text-sm text-m-red">{errors.username.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-12 bg-on-dark px-6 text-sm uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
