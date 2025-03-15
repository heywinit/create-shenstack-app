import { compare, hash } from "bcryptjs";

export const hashPassword = (password: string) => hash(password, 10);

export const comparePassword = (password: string, hashedPassword: string) =>
  compare(password, hashedPassword);
