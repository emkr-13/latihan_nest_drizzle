import { Injectable } from '@nestjs/common';
import { db } from '../../db/config.drizzle';
import { users } from '../../schema/user';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  async findUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    let datauser = {
      email: user.email,
      fullname: user.fullname,
      usercreated: user.createdAt,
    };
    return datauser;
  }

  async updateUserFullname(id: string, fullname: string) {
    const [updatedUser] = await db
      .update(users)
      .set({ fullname, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  async createUser(data: any) {
    return await db
      .insert(users)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }
  async findUserByEmail(email: string) {
    // console.log('email', email);

    const [user] = await db.select().from(users).where(eq(users.email, email));

    // console.log(user);
    return user;
  }
}
