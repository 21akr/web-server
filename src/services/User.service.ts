import { db } from './Postgres.service';

export class UserService {
  static async getBalance(_id: number): Promise<number> {
    const result = await db.query('SELECT balance FROM users');
    return result.rows[0].balance;
  }

  static async updateBalance(_id: number, newBalance: number): Promise<void> {
    console.log(newBalance, _id);
    await db.query(`UPDATE users SET balance = $1 WHERE id = $2`, [newBalance, _id]);
  }
}
