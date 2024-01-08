import { db } from "~/server/drizzle";
import { TagsTable } from "~/server/schema";

export default defineEventHandler(async (ctx) => {
  const body = await readBody(ctx);

  const tag = await db
    .insert(TagsTable)
    .values({ content: body.content, ip: ctx.headers.get("x-forwarded-for") })
    .returning();

  return tag;
});
