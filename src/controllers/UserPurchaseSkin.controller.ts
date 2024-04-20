import { Request, Response } from 'express';
import { SkinportService, UserService } from '../services';

export async function UserPurchaseSkinController(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);
  const itemId = parseInt(req.params.itemId);

  try {
    const userBalance = await UserService.getBalance(userId);
    const item = await SkinportService.getItemById(itemId);
    const price = await SkinportService.calculatePrice(item, true);

    if (userBalance >= price) {
      const newBalance = userBalance - price;
      await UserService.updateBalance(userId, newBalance);

      res.json({ message: 'Purchase successful' });
    } else {
      res.status(400).send('Insufficient funds');
    }
  } catch (err) {
    console.error('Error purchasing item:', err);
    res.status(500).send('Internal server error');
  }
}
