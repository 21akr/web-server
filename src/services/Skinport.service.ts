import { RedisService } from './Redis.service';

const redis = new RedisService();
redis.connect();

async function cachedData(): Promise<string | null> {
  return await redis.get('itemsWithPrices');
}

interface SkinportItem {
  market_hash_name: string;
  currency: string;
  suggested_price: number;
  item_page: string;
  market_page: string;
  min_price: number | null;
  max_price: number | null;
  mean_price: number | null;
  quantity: number;
  created_at: number;
  updated_at: number;
}

interface SkinportItemWithPrices extends SkinportItem {
  min_tradable: number | null;
  min_non_tradable: number | null;
}

export class SkinportService {
  private static expires = 3600;

  static async getItems(): Promise<SkinportItem[]> {
    const tradableItems = await fetch(`https://api.skinport.com/v1/items?tradable=1`);
    return await tradableItems.json();
  }

  static async getNonTradableItems(): Promise<SkinportItem[]> {
    const nonTradableItems = await fetch(`https://api.skinport.com/v1/items`);
    return await nonTradableItems.json();
  }

  static async getItemById(_id: number): Promise<SkinportItem> {
    const data = await cachedData();
    if (data) {
      const items = JSON.parse(data);
      return items[_id];
    }

    const items = await this.getItems();
    return items[_id];
  }

  static async getItemsWithPrices(): Promise<SkinportItemWithPrices[]> {
    const data = await cachedData();
    if (data) {
      return JSON.parse(data);
    }

    const [tradableItems, nonTradableItems] = await Promise.all([this.getItems(), this.getNonTradableItems()]);

    const itemsWithPrices = tradableItems.map((tradableItem, index) => {
      return {
        ...tradableItem,
        min_tradable: tradableItem.min_price,
        min_non_tradable: nonTradableItems[index].min_price,
      };
    });

    await redis.set('itemsWithPrices', JSON.stringify(itemsWithPrices), this.expires);

    return itemsWithPrices;
  }
}
