import { userOperations } from "../lib/db/operations";
import { comparePassword } from "../lib/utils/auth";

export class UserService {
  static async getAll() {
    return await userOperations.getAll();
  }

  static async getById(id: string) {
    const user = await userOperations.getById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  static async create(userData: any) {
    try {
      return await userOperations.create(userData);
    } catch (error) {
      throw new Error("Invalid user data");
    }
  }

  static async update(id: string, userData: any) {
    try {
      const updatedUser = await userOperations.update(id, userData);
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      throw new Error("Invalid user data");
    }
  }

  static async delete(id: string) {
    return await userOperations.delete(id);
  }
}
