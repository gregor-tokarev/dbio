import { db } from "~/server/drizzle";
import { TagsTable } from "~/server/schema";
import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async () => {
  return db
    .select()
    .from(TagsTable)
    .where(eq(TagsTable.approved, true))
    .orderBy(desc(TagsTable.likesCount));
});
