import { Injectable } from '@nestjs/common';
import { db } from '../../db/config.drizzle';
import { users } from '../../schema/user';
import { eq } from 'drizzle-orm';


@Injectable()
export class UserRepository {
  async findUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUserFullname(id: string, fullname: string) {
    const [updatedUser] = await db.update(users)
      .set({ fullname, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
}