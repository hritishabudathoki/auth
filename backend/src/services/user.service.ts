import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant.js";
import type { z } from "zod";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto.js";
import { HttpException } from "../exceptions/http-exception.js";
import type { IUserRepository } from "../repositories/user.repository.js";
import { UserMongoRepository } from "../repositories/user.repository.js";

type CreateUserInput = z.infer<typeof CreateUserDTO>;
type LoginUserInput = { email: string; password: string };
type UpdateUserInput = z.infer<typeof UpdateUserDTO>;

function omitPassword(user: {
  _id: unknown;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    _id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    profileImage: user.profileImage,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository ?? new UserMongoRepository();
  }

  async createUser(data: CreateUserInput) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new HttpException(409, "Email already in use");
    }

    const existingUsername = await this.userRepository.findByUsername(
      data.username
    );
    if (existingUsername) {
      throw new HttpException(409, "Username already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: data.role ?? "user",
    });

    return omitPassword(user);
  }

  async loginUser(data: LoginUserInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new HttpException(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    return {
      token,
      user: omitPassword(user),
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return omitPassword(user);
  }

  async updateUser(userId: string, data: UpdateUserInput) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail && String(existingEmail._id) !== userId) {
        throw new HttpException(409, "Email already in use");
      }
    }

    if (data.username && data.username !== user.username) {
      const existingUsername = await this.userRepository.findByUsername(
        data.username
      );
      if (existingUsername && String(existingUsername._id) !== userId) {
        throw new HttpException(409, "Username already in use");
      }
    }

    const updatePayload: Record<string, unknown> = {};

    if (data.firstName) {
      updatePayload.firstName = data.firstName;
    }

    if (data.lastName) {
      updatePayload.lastName = data.lastName;
    }

    if (data.email) {
      updatePayload.email = data.email;
    }

    if (data.username) {
      updatePayload.username = data.username;
    }

    if (data.profileImage) {
      updatePayload.profileImage = data.profileImage;
    }

    if (data.currentPassword && data.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new HttpException(401, "Current password is incorrect");
      }

      updatePayload.password = await bcrypt.hash(data.newPassword, 10);
    }

    const updatedUser = await this.userRepository.updateById(
      userId,
      updatePayload
    );

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return omitPassword(updatedUser);
  }

  async getUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const { users, total } = await this.userRepository.findAll(
      skip,
      limit,
      search
    );
    return {
      users: users.map((user) => omitPassword(user)),
      total,
    };
  }

  async adminCreateUser(data: CreateUserInput & { role?: "admin" | "user" }) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new HttpException(409, "Email already in use");
    }

    const existingUsername = await this.userRepository.findByUsername(
      data.username
    );
    if (existingUsername) {
      throw new HttpException(409, "Username already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: data.role ?? "user",
    });

    return omitPassword(user);
  }

  async adminUpdateUser(userId: string, data: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail && String(existingEmail._id) !== userId) {
        throw new HttpException(409, "Email already in use");
      }
    }

    if (data.username && data.username !== user.username) {
      const existingUsername = await this.userRepository.findByUsername(
        data.username
      );
      if (existingUsername && String(existingUsername._id) !== userId) {
        throw new HttpException(409, "Username already in use");
      }
    }

    const updatePayload: Record<string, unknown> = {};
    if (data.firstName) updatePayload.firstName = data.firstName;
    if (data.lastName) updatePayload.lastName = data.lastName;
    if (data.email) updatePayload.email = data.email;
    if (data.username) updatePayload.username = data.username;
    if (data.role) updatePayload.role = data.role;
    if (data.password) {
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.updateById(
      userId,
      updatePayload
    );
    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }
    return omitPassword(updatedUser);
  }

  async adminDeleteUser(userId: string) {
    const success = await this.userRepository.deleteById(userId);
    if (!success) {
      throw new HttpException(404, "User not found");
    }
    return true;
  }
}
