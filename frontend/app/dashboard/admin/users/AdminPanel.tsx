"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from "@/lib/api/auth";
import type { User, PaginationMeta } from "@/lib/api/auth";

// ─── Zod Schemas ────────────────────────────────────────────────────────────

const createSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "At least 3 characters"),
  password: z.string().min(6, "At least 6 characters"),
  role: z.enum(["user", "admin"]),
});

const editSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email").optional(),
  username: z.string().min(3, "At least 3 characters").optional(),
  password: z
    .string()
    .min(6, "At least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "admin"]).optional(),
});

type CreateForm = z.infer<typeof createSchema>;
type EditForm = z.infer<typeof editSchema>;

const LIMIT = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortId(id: string) {
  return id.slice(-5);
}

function getInitial(name: string) {
  return name ? name.charAt(0).toUpperCase() : "?";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: "admin" | "user" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] ${
        role === "admin"
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center justify-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      Active
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-800 border-t-blue-500" />
      <p className="text-xs text-zinc-500 tracking-wider uppercase">Loading database records...</p>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400 font-light">{msg}</p>;
}

const inputCls =
  "h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all";
const labelCls =
  "mb-1.5 block text-[10px] uppercase tracking-[1.5px] text-zinc-500 font-semibold";

// ─── Avatar Circle ────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initial = getInitial(name);
  const colors = [
    "from-blue-600 to-cyan-500",
    "from-emerald-600 to-teal-500",
    "from-indigo-600 to-purple-500",
    "from-rose-600 to-pink-500",
    "from-amber-600 to-orange-500",
    "from-violet-600 to-fuchsia-500",
  ];
  const colorIdx = name ? name.charCodeAt(0) % colors.length : 0;
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-gradient-to-br ${colors[colorIdx]} shadow-sm`}
    >
      {initial}
    </div>
  );
}

// ─── Create / Edit Modal ─────────────────────────────────────────────────────

function UserFormModal({
  mode,
  user,
  onClose,
  onSuccess,
}: {
  mode: "create" | "edit";
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateForm | EditForm>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: isEdit
      ? {
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          email: user?.email ?? "",
          username: user?.username ?? "",
          password: "",
          role: user?.role ?? "user",
        }
      : { role: "user" },
  });

  const onSubmit = (data: CreateForm | EditForm) => {
    setServerError("");
    startTransition(async () => {
      try {
        if (isEdit && user) {
          const payload: any = { ...data };
          if (!payload.password) delete payload.password;
          await adminUpdateUser(user._id, payload);
        } else {
          await adminCreateUser(data as CreateForm);
        }
        onSuccess();
        onClose();
      } catch (e: any) {
        setServerError(e.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900/50">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {isEdit ? "Update User Profile" : "Add New User"}
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
              {isEdit ? "Modify system privileges and values" : "Register a new administrative or guest account"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="space-y-4 p-6"
        >
          {serverError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>First Name</label>
              <input
                {...register("firstName")}
                placeholder="Jane"
                className={inputCls}
              />
              <FieldError msg={errors.firstName?.message} />
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <input
                {...register("lastName")}
                placeholder="Doe"
                className={inputCls}
              />
              <FieldError msg={errors.lastName?.message} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="jane@example.com"
              className={inputCls}
            />
            <FieldError msg={errors.email?.message} />
          </div>

          <div>
            <label className={labelCls}>Username</label>
            <input
              {...register("username")}
              placeholder="janedoe"
              className={inputCls}
            />
            <FieldError msg={errors.username?.message} />
          </div>

          <div>
            <label className={labelCls}>
              Account Password{" "}
              {isEdit && (
                <span className="normal-case text-zinc-600 font-light">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={inputCls}
            />
            <FieldError msg={errors.password?.message} />
          </div>

          <div>
            <label className={labelCls}>Privilege Group</label>
            <div className="relative">
              <select
                {...register("role")}
                className={`${inputCls} appearance-none bg-zinc-950`}
              >
                <option value="user">User (Standard Access)</option>
                <option value="admin">Admin (Full Control)</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <FieldError msg={errors.role?.message} />
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800/80 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-zinc-800 px-5 text-xs font-bold uppercase tracking-[1px] text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold uppercase tracking-[1px] text-white hover:opacity-90 shadow-md transition-all disabled:opacity-50"
            >
              {isPending
                ? isEdit
                  ? "Saving changes..."
                  : "Creating profile..."
                : isEdit
                ? "Save Changes"
                : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        <div className="border-b border-zinc-800 px-6 py-4 bg-zinc-900/50">
          <h2 className="text-base font-bold text-white tracking-wide">Revoke Account & Terminate</h2>
          <p className="text-[10px] text-red-400 uppercase tracking-wider mt-0.5">Destructive platform action</p>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed text-zinc-400">
            Confirming this will permanently delete{" "}
            <span className="font-semibold text-white">
              {user.firstName} {user.lastName}
            </span>{" "}
            (<span className="text-zinc-500 font-mono">@{user.username}</span>) from the database directory. All sessions will be ended immediately.
          </p>
          <div className="mt-6 flex gap-3 pt-4 border-t border-zinc-800/80">
            <button
              onClick={onClose}
              disabled={isPending}
              className="h-11 rounded-lg border border-zinc-800 px-5 text-xs font-bold uppercase tracking-[1px] text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-xs font-bold uppercase tracking-[1px] text-white hover:opacity-95 transition-all shadow-md disabled:opacity-50"
            >
              {isPending ? "Terminating..." : "Confirm & Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(meta.total / meta.limit);
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - meta.page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-5">
      <p className="text-xs text-zinc-500">
        Showing {(meta.page - 1) * meta.limit + 1}–
        {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} users
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 bg-zinc-900/30 transition-all hover:border-zinc-700 hover:text-white hover:bg-zinc-900/60 disabled:cursor-not-allowed disabled:opacity-20"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-xs text-zinc-700"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                p === meta.page
                  ? "border-blue-500 bg-blue-600/10 text-blue-400 shadow-sm"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 bg-zinc-900/30 transition-all hover:border-zinc-700 hover:text-white hover:bg-zinc-900/60 disabled:cursor-not-allowed disabled:opacity-20"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteIsPending, startDeleteTransition] = useTransition();

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminGetUsers({
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
      });
      setUsers(res.data ?? []);
      if (res.meta) setMeta(res.meta);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setSelectedUser(null);
    setModal("create");
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setModal("edit");
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    startDeleteTransition(async () => {
      try {
        await adminDeleteUser(selectedUser._id);
        closeModal();
        fetchUsers();
      } catch (e: any) {
        setError(e.message || "Failed to delete user");
        closeModal();
      }
    });
  };

  const columns = ["ID", "User Profile", "Email Address", "Privilege", "Status", "Joined", "Actions"];

  return (
    <div className="flex-1 min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute -left-10 -top-10 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-indigo-600/5 blur-[130px] pointer-events-none" />

      {/* ── Header Area ───────────────────────────────────────────── */}
      <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-blue-500">
            Platform Settings
          </p>
          <h1 className="mt-0.5 text-3xl font-extrabold uppercase tracking-[1px] text-white">
            User Management
          </h1>
          <p className="mt-1 text-xs text-zinc-500 font-light">
            Manage, verify, edit permissions, or delete accounts across the ExploreEase platform.
          </p>
        </div>
        <button
          id="admin-create-user"
          onClick={openCreate}
          className="flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-[11px] font-bold uppercase tracking-[1.5px] text-white transition-all duration-300 hover:opacity-90 shadow-md hover:shadow-blue-500/10 active:scale-98 shrink-0"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create User
        </button>
      </div>

      {/* ── Filters and Search ────────────────────────────────────── */}
      <div className="relative mb-6 max-w-lg group">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <svg
          className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-500 transition-colors group-hover:text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
          />
        </svg>
        <input
          id="admin-search"
          type="text"
          placeholder="Search accounts by name, username, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900/30 pl-11 pr-10 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:bg-zinc-900/50 focus:outline-none transition-all duration-300"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
            aria-label="Clear search"
          >
            <svg
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ── Error Banner ──────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4.5 py-3 text-xs text-red-400">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-400/60 transition-colors hover:text-red-400"
          >
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Table Container ───────────────────────────────────────── */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden backdrop-blur-md">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/40">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <Spinner />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-600 mb-4">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.342 9.342 0 0012.458 10.22M12 14.25a3 3 0 110-6 3 3 0 010 6zm-7.063 5.088A4.125 4.125 0 017.5 15.75h9a4.125 4.125 0 013.75 3.588M2.625 19.5a9.3 9.3 0 012.625-.372" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-zinc-400">
                        {debouncedSearch
                          ? `No matches found for "${debouncedSearch}"`
                          : "No profiles recorded"}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1.5 font-light">
                        Try refining your query or register a new account above.
                      </p>
                      {debouncedSearch && (
                        <button
                          onClick={() => setSearch("")}
                          className="mt-4 text-xs font-semibold uppercase tracking-[1px] text-blue-400 hover:text-blue-300"
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="group transition-colors hover:bg-zinc-900/30"
                  >
                    {/* Short MongoDB ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] text-zinc-600 group-hover:text-zinc-500 transition-colors">
                        {shortId(u._id)}
                      </span>
                    </td>

                    {/* Profile User Info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <Avatar name={u.firstName} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="truncate text-xs text-zinc-500 font-light mt-0.5">
                            @{u.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email address */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-zinc-400 font-light">{u.email}</span>
                    </td>

                    {/* Privilege Role badge */}
                    <td className="px-5 py-4">
                      <RoleBadge role={u.role} />
                    </td>

                    {/* Active Status Badge */}
                    <td className="px-5 py-4">
                      <StatusBadge />
                    </td>

                    {/* Date Joined */}
                    <td className="px-5 py-4">
                      <span className="text-xs text-zinc-500 font-light">
                        {formatDate(u.createdAt)}
                      </span>
                    </td>

                    {/* Edit & Delete Action Buttons */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          id={`edit-user-${u._id}`}
                          onClick={() => openEdit(u)}
                          className="h-8 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3.5 text-xs font-semibold uppercase tracking-[0.5px] text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white active:scale-97"
                        >
                          Edit
                        </button>
                        <button
                          id={`delete-user-${u._id}`}
                          onClick={() => openDelete(u)}
                          className="h-8 rounded-lg border border-red-500/20 bg-red-500/5 px-3.5 text-xs font-semibold uppercase tracking-[0.5px] text-red-400 transition-all hover:border-red-500/45 hover:bg-red-500/10 hover:text-red-400 active:scale-97"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component */}
      {!loading && users.length > 0 && (
        <Pagination meta={meta} onPageChange={setPage} />
      )}

      {/* Modal containers */}
      {(modal === "create" || modal === "edit") && (
        <UserFormModal
          mode={modal}
          user={selectedUser ?? undefined}
          onClose={closeModal}
          onSuccess={fetchUsers}
        />
      )}

      {modal === "delete" && selectedUser && (
        <DeleteModal
          user={selectedUser}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
          isPending={deleteIsPending}
        />
      )}
    </div>
  );
}
