import { Injectable } from '@nestjs/common';
import { db } from '../../db/config.drizzle';
import { categories } from '../../schema/categories';
import { and, eq, ilike, isNull,sql } from 'drizzle-orm';

@Injectable()
export class CategoriesRepository {
  async create(data: { name: string; description?: string }) {
    const [category] = await db.insert(categories).values(data).returning();
    return category;
  }

  async findAll(query: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const whereConditions = [
      isNull(categories.deletedAt),
      ...(search ? [ilike(categories.name, `%${search}%`)] : []),
    ];

    const results = await db
      .select()
      .from(categories)
      .where(and(...whereConditions))
      .limit(limit)
      .offset(offset);

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(and(...whereConditions))
      .then((res) => res[0].count);

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), isNull(categories.deletedAt)));
    return category;
  }

  async update(id: number, data: { name?: string; description?: string }) {
    const [category] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async softDelete(id: number) {
    const [category] = await db
      .update(categories)
      .set({ deletedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category;
  }
}
