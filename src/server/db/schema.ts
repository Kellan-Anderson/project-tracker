import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `project_tracker_${name}`);


/* ----------------------------------------------- Users and accounts ----------------------------------------------- */

export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  currentOrg: varchar('current_org', { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  forms: many(forms),
  projectsToUsers: many(projectsAndUsers),
  updates: many(updates),
}));

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    userIdIdx: index("userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userSessionId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

/* ----------------------------------------------------- Forms ------------------------------------------------------ */

export const forms = pgTable('forms', {
  id: varchar('id',  { length: 255 }).primaryKey(),
  urlId: varchar('url_id', { length: 127 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  owner: varchar('owner', { length: 255 }).notNull().references(() => users.id)
});

export const formsRelations = relations(forms, ({ one, many }) => ({
  owner: one(users, {
    fields: [forms.owner],
    references: [users.id]
  }),
  projects: many(projects)
}));

export const insertFormSchema = createInsertSchema(forms);
export const selectFormSchema = createSelectSchema(forms)

/* --------------------------------------------------- Projects ----------------------------------------------------- */

export const projectStatus = pgEnum('project_status', [
  'submitted',
  'scheduled',
  'in progress',
  'awaiting approval',
  'completed'
]);

export const projects = pgTable('projects', {
  id: varchar('id', { length: 255 }).primaryKey(),
  urlId: varchar('url_id', { length: 127 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: projectStatus('status').notNull().default('submitted'),
  requiresApproval: boolean('requires_approval').default(false),
  receiveUpdates: boolean('receive_updates').default(false),
  createdAt: timestamp('created_at').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow(),
  username: varchar('user_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  formUrl: varchar('form_url', { length: 255 }).notNull().references(() => forms.urlId),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  form: one(forms, {
    fields: [projects.formUrl],
    references: [forms.urlId]
  }),
  projectsToUsers: many(projectsAndUsers),
  updates: many(updates)
}));

export const insertProjectsSchema = createInsertSchema(projects);
export const selectProjectsSchema = createSelectSchema(projects);

export const permissionsEnum = pgEnum('permissions', ['viewer', 'editor', 'owner'])

export const projectsAndUsers = pgTable('projects_and_users', {
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id),
  projectId: varchar('project_id', { length: 255 }).notNull().references(() => projects.id),
  permission: permissionsEnum('permission').default('viewer').notNull()
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.projectId] })
}));

export const insertProjectsAndUsersSchema = createInsertSchema(projectsAndUsers);
export const selectProjectsAndUsersSchema = createSelectSchema(projectsAndUsers);

export const projectsAndUsersRelations = relations(projectsAndUsers, ({ one }) => ({
  user: one(users, {
    fields: [projectsAndUsers.userId],
    references: [users.id]
  }),
  project: one(projects, {
    fields: [projectsAndUsers.projectId],
    references: [projects.id]
  })
}))


/* --------------------------------------------------- Updates  ----------------------------------------------------- */

export const notificationType = pgEnum('notification_type', ['notifying', 'non-notifying']);

export const updates = pgTable('updates', {
  id: varchar('id', { length: 255 }).primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull().references(() => projects.id),
  authorId: varchar('author_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  notificationType: notificationType('notification_type').notNull().default('non-notifying'),
  isEdited: boolean('is_edited').notNull().default(false)
})

export const updatesRelations = relations(updates, ({ one }) => ({
  project: one(projects, {
    fields: [updates.projectId],
    references: [projects.id]
  }),
  author: one(users, {
    fields: [updates.authorId],
    references: [users.id]
  })
}));

export const updatesInsertSchema = createInsertSchema(updates);
export const updatesSelectSchema = createSelectSchema(updates);