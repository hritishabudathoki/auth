"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "@/lib/api/auth";
import type { User } from "@/lib/api/auth";
import { useAuth } from "@/lib/providers/auth-provider";
import {
  passwordUpdateSchema,
  type PasswordUpdateFormValues,
} from "./profile-schema";

export default function PasswordUpdateForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: PasswordUpdateFormValues) => {
    setServerMessage(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("currentPassword", values.currentPassword);
      formData.append("newPassword", values.newPassword);

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
        reset();
        router.refresh();
      } catch (error) {
        setServerMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to update password",
        });
      }
    });
  };

  return (
    <div className="border border-hairline bg-surface-card p-6 sm:p-8">
      <div className="mb-8 border-b border-hairline pb-8">
        <p className="text-xs uppercase tracking-[1.5px] text-muted">
          Password update
        </p>
        <h1 className="mt-3 text-2xl font-light uppercase tracking-[1.5px] text-on-dark">
          Change your password
        </h1>
        <p className="mt-3 max-w-xl text-sm font-light text-body">
          Use your current password to set a new one. This uses the same
          protected update endpoint as your profile form.
        </p>
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
            Current Password
          </label>
          <input
            type="password"
            className="h-12 w-full border border-hairline bg-canvas px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="mt-1.5 text-sm text-m-red">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
            New Password
          </label>
          <input
            type="password"
            className="h-12 w-full border border-hairline bg-canvas px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="mt-1.5 text-sm text-m-red">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
            Confirm New Password
          </label>
          <input
            type="password"
            className="h-12 w-full border border-hairline bg-canvas px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-m-red">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-12 bg-on-dark px-6 text-sm uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
