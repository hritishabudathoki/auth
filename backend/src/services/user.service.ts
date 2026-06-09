import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant.js";
import type { z } from "zod";
import { CreateUserDTO } from "../dtos/user.dto.js";
import { HttpException } from "../exceptions/http-exception.js";
import type { IUserRepository } from "../repositories/user.repository.js";
import { UserMongoRepository } from "../repositories/user.repository.js";

type CreateUserInput = z.infer<typeof CreateUserDTO>;
type LoginUserInput = { email: string; password: string };

function omitPassword(user: {
  _id: unknown;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
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
}
