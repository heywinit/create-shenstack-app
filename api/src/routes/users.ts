import { t } from "elysia";
import { UserService } from "../services/userService";
import { app } from "../lib/app";

export const users = app.group("/users", (app) =>
  app
    .get("/", async () => {
      return await UserService.getAll();
    })
    .get("/:id", async ({ params }) => {
      return await UserService.getById(params.id);
    })
    .post(
      "/",
      async ({ body }) => {
        const newUser = await UserService.create(body);
        return { success: true, user: newUser };
      },
      {
        body: t.Object({
          email: t.String(),
          password: t.String(),
        }),
      }
    )
    .put(
      "/:id",
      async ({ params, body }) => {
        const updatedUser = await UserService.update(params.id, body);
        return { success: true, user: updatedUser };
      },
      {
        body: t.Object({
          // Add validation schema for updateable fields
          email: t.Optional(t.String()),
          password: t.Optional(t.String()),
          // Add other optional fields
        }),
      }
    )
    .delete("/:id", async ({ params }) => {
      await UserService.delete(params.id);
      return { success: true };
    })
);
