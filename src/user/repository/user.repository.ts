import { Injectable } from '@nestjs/common';
import { db } from '../../db/config.drizzle';
import { users } from '../../schema/user';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  async findUserById(id: string) {
    return await db.select().from(users).where(eq(users.id, id));
  }
}