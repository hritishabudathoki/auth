import { UpdateUserSchema, UserSchema } from "../types/user.type.js";

export const CreateUserDTO = UserSchema;

export const LoginUserDTO = UserSchema.pick({
  email: true,
  password: true,
});

export const UpdateUserDTO = UpdateUserSchema;
