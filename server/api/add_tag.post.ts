import { db } from "~/server/drizzle";
import { TagsTable } from "~/server/schema";

export default defineEventHandler(async (ctx) => {
  const body = await readBody(ctx);
  const ip = getRequestIP(ctx);

  console.log(body);
  const tag = await db
    .insert(TagsTable)
    .values({ content: body.content, ip })
    .returning();

  return tag;
});
