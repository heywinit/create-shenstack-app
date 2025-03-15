import { t } from "elysia";
import { AuthService } from "../services/authService";
import { app } from "../lib/app";

export const auth = app.group("/auth", (app) =>
  app.post(
    "/login",
    async ({ body, jwt, set, db }) => {
      try {
        const user = await AuthService.login(db, {
          username: body.username,
          password: body.password,
        });

        const token = await jwt.sign({
          userId: user.id,
        });

        return {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        };
      } catch (error) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid credentials",
        };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        clientCode: t.String(),
      }),
    }
  )
);
