import * as bcrypt from 'bcrypt';
import { db } from '../db/config.drizzle';
import { users } from '../schema/user';

async function seed() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    await db.insert(users).values([
      {
        email: 'admin@example.com',
        password: hashedPassword,
        fullname: 'Admin User',
        role: 'admin',
      },
      {
        email: 'user@example.com',
        password: hashedPassword,
        fullname: 'Regular User',
        role: 'user',
      },
    ]);

    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    process.exit();
  }
}

seed();