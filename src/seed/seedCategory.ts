import { db } from '../db/config.drizzle';
import { categories } from '../schema/categories';

async function seed() {
  try {
    await db.insert(categories).values([
      {
        name: 'Electronics',
        description: 'Devices and gadgets',
      },
      {
        name: 'Books',
        description: 'Literature and educational materials',
      },
      {
        name: 'Clothing',
        description: 'Apparel and accessories',
      },
      {
        name: 'Home & Kitchen',
        description: 'Furniture and kitchenware',
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sporting goods and outdoor equipment',
      },
      {
        name: 'Health & Beauty',
        description: 'Personal care and wellness products',
      },
      {
        name: 'Toys & Games',
        description: "Children's toys and games",
      },
      {
        name: 'Automotive',
        description: 'Car parts and accessories',
      },
    ]);

    console.log('✅ Categories successfully');
  } catch (error) {
    console.error('❌ Error seeding Categories:', error);
  } finally {
    process.exit();
  }
}

seed();
