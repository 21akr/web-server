import { Request, Response } from 'express';
import { SkinportService, UserService } from '../services';

export async function UserPurchaseSkinController(req: Request, res: Response) {
  const userId = Number(req.query.userId);
  const itemId = Number(req.query.itemId);
  console.log(userId);
  console.log(itemId);

  console.log(typeof userId);
  console.log(typeof itemId);

  try {
    const userBalanceCents = await UserService.getBalance(userId);
    const item = await SkinportService.getItemById(itemId);
    const price = item?.min_price;
    console.log('price, ', price);

    if (!item) throw new Error('Item not found');

    if (price !== undefined && userBalanceCents >= price) {
      const newBalanceCents = userBalanceCents - price;
      await UserService.updateBalance(userId, newBalanceCents);
      const newBalance = newBalanceCents / 100;
      res.send(`An item for ${price / 100} EUR is purchased!\nYour balance is: ${newBalance} EUR`);
    } else {
      res.status(400).send('Insufficient funds');
    }
  } catch (err) {
    console.error('Error purchasing item:', err);
    res.status(500).send('Internal server error');
  }
}
