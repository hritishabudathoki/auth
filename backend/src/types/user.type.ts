import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]).default("user"),
});

export const UpdateUserSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .optional(),
    profileImage: z.string().optional(),
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters")
      .optional(),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .optional(),
  })
  .refine(
    (data) =>
      (!data.currentPassword && !data.newPassword) ||
      (Boolean(data.currentPassword) && Boolean(data.newPassword)),
    {
      message: "Current password and new password are required together",
      path: ["currentPassword"],
    }
  );

export type UserType = z.infer<typeof UserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

export type SafeUser = Omit<UserType, "password"> & {
  _id: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
