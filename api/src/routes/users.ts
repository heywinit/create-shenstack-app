import { t } from "elysia";
import { UserService } from "../services/userService";
import { app } from "../lib/app";
import { AuthService } from "../services/authService";

export const users = app.group("/users", (app) =>
  app
    // Add auth middleware to protect all routes
    .derive({ as: "global" }, AuthService.authMiddleware)
    .get("/", async ({ user }) => {
      // Only admin users should be able to get all users
      // For now, we'll just return all users
      return await UserService.getAll();
    })
    .get("/:id", async ({ params, user }) => {
      // In a real app, you might want to check if the user has permission to view this profile
      return await UserService.getById(params.id);
    })
    .post(
      "/",
      async ({ body, user }) => {
        // In a real app, you might want to check if the user has admin permissions
        const newUser = await UserService.create(body);
        return { success: true, user: newUser };
      },
      {
        body: t.Object({
          email: t.String(),
          password: t.String(),
          name: t.Optional(t.String()),
        }),
      }
    )
    .put(
      "/:id",
      async ({ params, body, user }) => {
        // In a real app, you might want to check if the user is updating their own profile or has admin permissions
        const updatedUser = await UserService.update(params.id, body);
        return { success: true, user: updatedUser };
      },
      {
        body: t.Object({
          email: t.Optional(t.String()),
          password: t.Optional(t.String()),
          name: t.Optional(t.String()),
        }),
      }
    )
    .delete("/:id", async ({ params, user }) => {
      // In a real app, you might want to check if the user is deleting their own profile or has admin permissions
      await UserService.delete(params.id);
      return { success: true };
    })
);
