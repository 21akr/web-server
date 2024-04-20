import { Router } from 'express';
import { GetItemsListController, UserPurchaseSkinController } from './controllers';

export const router = Router();

router.get('/items', GetItemsListController);
router.post('/purchase', UserPurchaseSkinController);
