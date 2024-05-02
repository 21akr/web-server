import { Request, Response } from 'express';
import { SkinportService, UserService } from '../services';

export async function UserPurchaseSkinController(req: Request, res: Response) {
  const userId: number = Number(req.query.userId);
  const itemId: number = Number(req.query.itemId);

  try {
    const userBalance = await UserService.getBalance(userId);
    const item = await SkinportService.getItemById(itemId);
    const price = item?.min_price;

    if (!item) throw new Error('Item not found');

    if (price !== undefined && userBalance >= price) {
      const newBalance = userBalance - price;
      if (newBalance >= 0) {
        await UserService.updateBalance(userId, newBalance);
        res.send(`An item for ${price} EUR is purchased!\nYour balance is: ${newBalance}`);
      } else {
        res.status(400).send('Insufficient funds');
      }
    } else {
      res.status(400).send('Insufficient funds');
    }
  } catch (err) {
    console.error('Error purchasing item:', err);
    res.status(500).send('Internal server error');
  }
}
