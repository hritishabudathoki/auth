import type { IUser } from "../models/user.model.js";
import { UserModel } from "../models/user.model.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(data: Partial<IUser>): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  findAll(
    skip: number,
    limit: number,
    search?: string
  ): Promise<{ users: IUser[]; total: number }>;
  deleteById(id: string): Promise<boolean>;
}

export class UserMongoRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async findAll(
    skip: number,
    limit: number,
    search?: string
  ): Promise<{ users: IUser[]; total: number }> {
    const query: Record<string, any> = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
      ];
    }

    const total = await UserModel.countDocuments(query);
    const users = await UserModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { users, total };
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }
}
