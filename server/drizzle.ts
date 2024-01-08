import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { TagsTable } from "~/server/schema";

export const db = drizzle(sql);

export type Tag = InferSelectModel<typeof TagsTable>;
export type NewTag = InferInsertModel<typeof TagsTable>;
