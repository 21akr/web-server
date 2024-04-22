import { db } from './Postgres.service';

export class UserService {
  static async getBalance(_id: number): Promise<number> {
    const result = await db.query(`SELECT balance FROM users WHERE id = $1`, [_id]);
    return result.rows[0].balance;
  }

  static async updateBalance(_id: number, newBalance: number): Promise<void> {
    await db.query(`UPDATE users SET balance = $1 WHERE id = $2`, [newBalance, _id]);
  }
}
