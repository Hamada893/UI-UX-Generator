import { integer, pgTable, varchar, date, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(5).notNull(),
});

export const ProjectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar().notNull(),
  userInput: varchar(),
  deviceType: varchar().notNull(),
  createdOn: date().defaultNow(),
  config: json(),
  userId: varchar().references(() => usersTable.email).notNull(),
})
