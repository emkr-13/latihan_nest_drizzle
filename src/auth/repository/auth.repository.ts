import { Injectable } from '@nestjs/common';
import { db } from '../../db/config.drizzle';
import { users } from '../../schema/user';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthRepository {
  async findUserByEmail(email: string) {
    return await db.select().from(users).where(eq(users.email, email));
  }

  async createUser(data: any) {
    return await db
      .insert(users)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }
}
