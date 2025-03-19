import { t } from "elysia";
import { AuthService } from "../services/authService";
import { app } from "../lib/app";
import { UserService } from "../services/userService";

export const auth = app.group("/auth", (app) =>
  app
    .post(
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
        }),
      }
    )
    .post(
      "/register",
      async ({ body, jwt, set }) => {
        try {
          // Check if user already exists
          const existingUser = await UserService.getByEmail(body.email);
          if (existingUser) {
            set.status = 400;
            return {
              success: false,
              message: "User with this email already exists",
            };
          }

          // Create new user
          const user = await UserService.create({
            email: body.email,
            password: body.password,
            name: body.name,
          });

          // Generate token
          const token = await jwt.sign({
            userId: user.id,
          });

          return {
            success: true,
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            },
          };
        } catch (error) {
          set.status = 500;
          return {
            success: false,
            message: "Error creating user",
          };
        }
      },
      {
        body: t.Object({
          email: t.String(),
          password: t.String(),
          name: t.Optional(t.String()),
        }),
      }
    )
    .get("/me", async ({ headers, jwt, set, db }) => {
      try {
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

        // Verify the token
        const payload = await jwt.verify(token);
        if (!payload || !payload.userId) {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized: Invalid token",
          };
        }

        // Get the user from database
        const user = await UserService.getById(String(payload.userId));

        if (!user) {
          set.status = 404;
          return {
            success: false,
            message: "User not found",
          };
        }

        return {
          success: true,
          user,
        };
      } catch (error) {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized: Invalid token",
        };
      }
    })
);
