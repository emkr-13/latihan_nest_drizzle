import { db } from '../db/config.drizzle';
import { products } from '../schema/product';

async function seed() {
  try {
    await db.insert(products).values([
      {
        name: 'Laptop',
        price: 999,
        stock: 50,
        isActive: true,
        categoryId: 1,
      },
      {
        name: 'Smartphone',
        price: 699,
        stock: 100,
        isActive: true,
        categoryId: 1,
      },
      {
        name: 'Headphones',
        price: 199,
        stock: 200,
        isActive: true,
        categoryId: 1,
      },
      {
        name: 'Novel',
        price: 15,
        stock: 300,
        isActive: true,
        categoryId: 2,
      },
      {
        name: 'Cookbook',
        price: 25,
        stock: 150,
        isActive: true,
        categoryId: 2,
      },
        {
            name: 'T-shirt',
            price: 20,
            stock: 500,
            isActive: true,
            categoryId: 3,
        },
        {
            name: 'Jeans',
            price: 40,
            stock: 300,
            isActive: true,
            categoryId: 3,
        },
        {
            name: 'Sofa',
            price: 499,
            stock: 20,
            isActive: true,
            categoryId: 4,
        },
        {
            name: 'Blender',
            price: 99,
            stock: 80,
            isActive: true,
            categoryId: 4,
        },
        {
            name: 'Basketball',
            price: 29,
            stock: 150,
            isActive: true,
            categoryId: 5,
        },
        {
            name: 'Tent',
            price: 199,
            stock: 50,
            isActive: true,
            categoryId: 5,
        },
        {
            name: 'Shampoo',
            price: 10,
            stock: 200,
            isActive: true,
            categoryId: 6,
        },
        {
            name: 'Moisturizer',
            price: 25,
            stock: 100,
            isActive: true,
            categoryId: 6,
        },
        {
            name: 'Action Figure',
            price: 15,
            stock: 300,
            isActive: true,
            categoryId: 7,
        },
        {
            name: 'Puzzle',
            price: 20,
            stock: 250,
            isActive: true,
            categoryId: 7,
        },
        {
            name: 'Car Battery',
            price: 120,
            stock: 30,
            isActive: true,
            categoryId: 8,
        },
        {
            name: 'Tire',
            price: 80,
            stock: 40,
            isActive: true,
            categoryId: 8,
        },
    ]);

    console.log('✅ Products seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Product:', error);
  } finally {
    process.exit();
  }
}

seed();
