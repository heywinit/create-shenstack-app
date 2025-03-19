import { prisma } from "../lib/db";
import { AuthService } from "./authService";

interface CreateUserParams {
  email: string;
  password: string;
  name?: string;
}

interface UpdateUserParams {
  email?: string;
  password?: string;
  name?: string;
}

export class UserService {
  /**
   * Get all users
   */
  static async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Get a user by ID
   */
  static async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Get a user by email
   */
  static async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Create a new user
   */
  static async create(params: CreateUserParams) {
    // Hash the password
    const hashedPassword = await AuthService.hashPassword(params.password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: params.email,
        password: hashedPassword,
        name: params.name,
      },
    });

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update a user
   */
  static async update(id: string, params: UpdateUserParams) {
    const updateData: any = { ...params };

    // If password is included, hash it
    if (params.password) {
      updateData.password = await AuthService.hashPassword(params.password);
    }

    // Update the user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Delete a user
   */
  static async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
