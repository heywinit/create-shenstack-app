import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

interface LoginParams {
  username: string;
  password: string;
}

export class AuthService {
  /**
   * Authenticate a user by username (email) and password
   */
  static async login(db: PrismaClient, params: LoginParams) {
    // Find the user by email
    const user = await db.user.findUnique({
      where: { email: params.username },
    });

    // If user not found or password doesn't match
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(
      params.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  /**
   * Generate hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verify if a token is valid
   */
  static async verifyToken(jwt: any, token: string) {
    try {
      const payload = await jwt.verify(token);
      if (!payload) {
        throw new Error("Invalid token");
      }
      return payload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  /**
   * Authentication middleware for protected routes
   */
  static authMiddleware = ({ jwt, headers, set, db }: any) => {
    // Get the authorization header
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized: No token provided",
      };
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token and return promise
    return jwt
      .verify(token)
      .then(async (payload: any) => {
        if (!payload || !payload.userId) {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized: Invalid token",
          };
        }

        // Get the user from database
        const user = await db.user.findUnique({
          where: { id: String(payload.userId) },
          select: {
            id: true,
            email: true,
            name: true,
          },
        });

        if (!user) {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized: User not found",
          };
        }

        // Return user for further use
        return { user };
      })
      .catch(() => {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized: Invalid token",
        };
      });
  };
}
