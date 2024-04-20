import { Request, Response} from 'express'
import { SkinportService } from '../services';
export async function GetItemsListController(req: Request, res: Response){
  try {
    const itemsWithPrices = await SkinportService.getItemsWithPrices();

    res.json(itemsWithPrices);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).send('Internal server error');
  }
}