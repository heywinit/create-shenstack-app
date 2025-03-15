import type { Database } from "../lib/db/types";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword } from "../lib/utils/auth";

export class AuthService {
  static async login(
    db: Database,
    credentials: {
      username: string;
      password: string;
    }
  ) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, credentials.username),
      with: {
        client: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await comparePassword(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
