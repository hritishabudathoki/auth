"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { handleRegisterUser } from "@/lib/actions/auth-action";
import { registerSchema, type RegisterFormValues } from "./schema";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        username: values.username,
        password: values.password,
      };
      const result = await handleRegisterUser(payload);
      if (result.success) {
        router.push("/login");
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
        Create Account
      </h1>
      <p className="mb-8 text-sm font-light text-muted">
        Join ExploreEase and start exploring
      </p>

      {serverError && (
        <div className="mb-6 border border-m-red bg-m-red/10 px-4 py-3 text-sm text-m-red">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              className="h-12 w-full border border-hairline bg-surface-card px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
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
              placeholder="Doe"
              className="h-12 w-full border border-hairline bg-surface-card px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="mt-1.5 text-sm text-m-red">{errors.lastName.message}</p>
            )}
          </div>
        </div>

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
            Username
          </label>
          <input
            type="text"
            placeholder="johndoe"
            className="h-12 w-full border border-hairline bg-surface-card px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1.5 text-sm text-m-red">{errors.username.message}</p>
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

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[1.5px] text-body">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="h-12 w-full border border-hairline bg-surface-card px-4 text-sm text-on-dark focus:border-on-dark focus:outline-none"
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
          className="mt-2 h-12 w-full bg-on-dark text-sm text-canvas uppercase tracking-[1.5px] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-light text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-on-dark underline-offset-4 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
