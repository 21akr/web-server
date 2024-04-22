import { Request, Response } from 'express';
import { SkinportService, UserService } from '../services';

export async function UserPurchaseSkinController(req: Request, res: Response) {
  const userId: number = parseInt(req.params.userId);
  const itemId: number = parseInt(req.params.itemId);

  console.log(req.query);
  console.log(req);

  try {
    const userBalance = await UserService.getBalance(userId);
    const item = await SkinportService.getItemById(itemId);
    const price = item?.min_price || 10;

    // if(!item) throw new Error('Item not found');

    if (price !== null && userBalance >= price) {
      const newBalance = userBalance - price;
      await UserService.updateBalance(userId, newBalance);
      res.send(`An item for ${price} EUR is purchased!`)
    } else {
      res.status(400).send('Insufficient funds');
    }
  } catch (err) {
    console.error('Error purchasing item:', err);
    res.status(500).send('Internal server error');
  }
}
