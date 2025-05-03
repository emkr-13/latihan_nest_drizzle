import {
  pgTable,
  varchar,
  integer,
  serial,
  boolean,
    timestamp,
} from 'drizzle-orm/pg-core';
import { categories } from './categories';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
