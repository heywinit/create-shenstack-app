import { getDb } from ".";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

export const userOperations = {
  async getAll() {
    const db = getDb();
    return db.select().from(schema.users);
  },

  async getById(id: string) {
    const db = getDb();
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return result[0];
  },

  async create(data: Omit<schema.NewUser, "id" | "createdAt" | "updatedAt">) {
    const db = getDb();
    const newUser: schema.NewUser = {
      ...data,
    };

    const [inserted] = await db
      .insert(schema.users)
      .values(newUser)
      .returning();
    return inserted;
  },

  async update(
    id: string,
    data: Partial<Omit<schema.NewUser, "id" | "createdAt">>
  ) {
    const db = getDb();
    const [updated] = await db
      .update(schema.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();

    return updated;
  },

  async delete(id: string) {
    const db = getDb();
    await db.delete(schema.users).where(eq(schema.users.id, id));
    return true;
  },
};

export const postOperations = {
  async getAll() {
    const db = getDb();
    return db.select().from(schema.posts);
  },

  async getById(id: string) {
    const db = getDb();
    const result = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id));
    return result[0];
  },

  async create(data: Omit<schema.NewPost, "id" | "createdAt" | "updatedAt">) {
    const db = getDb();
    const newPost: schema.NewPost = {
      ...data,
    };

    const [inserted] = await db
      .insert(schema.posts)
      .values(newPost)
      .returning();
    return inserted;
  },

  async update(
    id: string,
    data: Partial<Omit<schema.NewPost, "id" | "createdAt">>
  ) {
    const db = getDb();
    const [updated] = await db
      .update(schema.posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.posts.id, id))
      .returning();

    return updated;
  },

  async delete(id: string) {
    const db = getDb();
    await db.delete(schema.posts).where(eq(schema.posts.id, id));
    return true;
  },
};
