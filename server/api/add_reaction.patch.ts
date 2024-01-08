import { db } from "~/server/drizzle";
import { TagsTable } from "~/server/schema";
import { eq, sql } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core/query-builders/update";

export default defineEventHandler(async (ctx) => {
  const body = await readBody(ctx);

  let updates: PgUpdateSetSource<typeof TagsTable> = {};
  if (body.reaction === "like") {
    updates["likesCount"] = sql`${TagsTable.likesCount} + 1`;
  } else if (body.reaction === "dislike") {
    updates["dislikesCount"] = sql`${TagsTable.dislikesCount} + 1`;
  }

  return db
    .update(TagsTable)
    .set(updates)
    .where(eq(TagsTable.id, body.tagId))
    .returning();
});
