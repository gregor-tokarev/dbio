import { db } from "~/server/drizzle";
import { TagsTable } from "~/server/schema";

export default defineEventHandler(async () => {
  return db.select().from(TagsTable).orderBy(TagsTable.likesCount);
});
