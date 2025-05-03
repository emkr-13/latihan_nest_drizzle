import { Injectable } from '@nestjs/common';
import { db } from '../../db/config.drizzle';
import { users } from '../../schema/user';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthRepository {
  async findUserByEmail(email: string) {
    console.log('email', email);
  
    const [user] = await db.select().from(users).where(eq(users.email, email));

    // console.log(user);
    return user;
  }

  async createUser(data: any) {
    return await db
      .insert(users)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }
}
