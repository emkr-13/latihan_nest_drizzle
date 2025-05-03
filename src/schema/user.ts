import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enum untuk Role
export const roleEnum = pgEnum('role', ['admin', 'user']);

// Tabel Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 50 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  fullname: varchar('fullname', { length: 150 }),
  role: roleEnum('role').default('user').notNull(),
  refreshToken: varchar('refresh_token', { length: 255 }),
  refreshTokenExp: timestamp('refresh_token_exp'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
