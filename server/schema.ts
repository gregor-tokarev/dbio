import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const TagsTable = pgTable("tags", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  ip: text("ip"),
  approved: boolean("approved").default(false),
  likesCount: integer("likesCount").notNull().default(0),
  dislikesCount: integer("dislikesCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
