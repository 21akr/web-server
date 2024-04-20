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
  static async getItems(): Promise<SkinportItem[]> {
    const response = await fetch(`https://api.skinport.com/v1/items`);
    return await response.json();
  }

  static async getNonTradableItems(): Promise<SkinportItem[]> {
    const response = await fetch(`https://api.skinport.com/v1/items?tradable=1`);
    return await response.json();
  }

  static async getItemById(_id: number): Promise<SkinportItem> {
    const items = await this.getItems();
    return items[_id];
  }

  static async getItemsWithPrices(): Promise<SkinportItemWithPrices[]> {
    const tradableItems = await this.getItems();
    const nonTradableItems = await this.getNonTradableItems();

    return await Promise.all(tradableItems.map((tradableItem, index) => {
      return {
        ...tradableItem,
        min_tradable: tradableItem.min_price,
        min_non_tradable: nonTradableItems[index].min_price,
      };
    }));
  }
}
