import { sql } from "drizzle-orm";
import { bigint, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const permissionsEnum = pgEnum("permissions", ["SuperAdmin", "Admin", "Driver", "Manager", "Beta", "GPS"]);

export const userSchema = pgTable("auth_user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullname: text("fullname").notNull(),
  id_1c: uuid("id_1c"),
  google_id: text("google_id"),
  facebook_id: text("facebook_id"),
  allowed_ips: text("allowed_ips").array().default(sql`'{}'`).notNull(),
  permissions: permissionsEnum("permissions").array().default(sql`'{}'`).notNull(),
  active_days: text("active_days").array().default(sql`'{}'`).notNull(),
});

export const sessionSchema = pgTable("user_session", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => userSchema.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  active_expires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idle_expires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  browser: text("browser").default("Unknown").notNull(),
  os: text("os").default("Unknown").notNull(),
});

export const keySchema = pgTable("user_key", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => userSchema.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  hashed_password: text("hashed_password"),
});
