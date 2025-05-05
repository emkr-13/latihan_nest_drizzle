import { Injectable } from '@nestjs/common';
import { db } from '../../db/config.drizzle';
import { products } from '../../schema/product';
import { and, eq, ilike, isNull,sql } from 'drizzle-orm';
import { categories } from '../../schema/categories';

@Injectable()
export class ProductRepository {
  async create(data: {
    name: string;
    price: number;
    stock: number;
    isActive: boolean;
    categoryId: number;
  }) {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  }

  async findAll(query: {
    search?: string;
    categoryId?: number;
    page?: number;
    limit?: number;
  }) {
    const { search, categoryId, page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const whereConditions = [
      isNull(products.deletedAt),
      ...(search ? [ilike(products.name, `%${search}%`)] : []),
      ...(categoryId ? [eq(products.categoryId, categoryId)] : []),
    ];

    const results = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        stock: products.stock,
        isActive: products.isActive,
        category: {
          id: categories.id,
          name: categories.name,
        },
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...whereConditions))
      .limit(limit)
      .offset(offset);

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
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
    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        stock: products.stock,
        isActive: products.isActive,
        category: {
          id: categories.id,
          name: categories.name,
        },
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.id, id), isNull(products.deletedAt)));

    return product;
  }

  async update(id: number, data: {
    name?: string;
    price?: number;
    stock?: number;
    isActive?: boolean;
    categoryId?: number;
  }) {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async softDelete(id: number) {
    const [product] = await db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }
}