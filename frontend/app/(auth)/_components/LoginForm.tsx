"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { handleLoginUser } from "@/lib/actions/auth-action";
import type { User } from "@/lib/api/auth";
import { useAuth } from "@/lib/providers/auth-provider";
import { loginSchema, type LoginFormValues } from "./schema";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await handleLoginUser(values);
      if (result.success) {
        if (
          result.data &&
          typeof result.data === "object" &&
          "user" in result.data &&
          result.data.user
        ) {
          setUser(result.data.user as User);
        }
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setServerError(result.message);
    });
  };

  return (
    <>
      <div className="mb-8 hidden lg:block">
        <div className="m-stripe mb-8 w-12" />
      </div>

      <h1 className="mb-2 text-2xl font-light uppercase tracking-[1.5px] text-on-dark">
        Welcome Back
      </h1>
      <p className="mb-8 text-sm font-light text-muted">
        Sign in to your ExploreEase account
      </p>

      {serverError && (
        <div className="mb-6 border border-m-red bg-m-red/10 px-4 py-3 text-sm text-m-red">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="h-12 w-full border border-hairline bg-surface-card px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-m-red">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="h-12 w-full border border-hairline bg-surface-card px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-m-red">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 h-12 w-full bg-on-dark text-sm text-canvas uppercase tracking-[1.5px] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-light text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-on-dark underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </>
  );
}
