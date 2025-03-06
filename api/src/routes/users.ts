import { Elysia } from "elysia";
import { userOperations } from "../lib/db/operations";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    const users = await userOperations.getAll();
    return users;
  })
  .get("/:id", async ({ params }) => {
    const user = await userOperations.getById(params.id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  })
  .post("/", async ({ body }) => {
    try {
      const newUser = await userOperations.create(body as any);
      return { success: true, user: newUser };
    } catch (error) {
      throw new Error("Invalid user data");
    }
  })
  .put("/:id", async ({ params, body }) => {
    try {
      const updatedUser = await userOperations.update(params.id, body as any);
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return { success: true, user: updatedUser };
    } catch (error) {
      throw new Error("Invalid user data");
    }
  })
  .delete("/:id", async ({ params }) => {
    await userOperations.delete(params.id);
    return { success: true };
  });
