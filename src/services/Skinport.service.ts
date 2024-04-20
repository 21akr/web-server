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
  static async getItemById(_id: number): Promise<SkinportItem[]> {
    const response = await fetch(`https://api.skinport.com/v1/items/${_id}`);
    return await response.json();
  }

  static async calculatePrice(item: any, tradable: boolean): Promise<number> {
    return tradable ? item.min_price : item.max_price;
  }

  static async getItemsWithPrices(): Promise<SkinportItemWithPrices[]> {
    const response = await fetch('https://api.skinport.com/v1/items');
    const items = await response.json();
    return await Promise.all(
      items.map(async item => {
        const min_tradable = await this.calculatePrice(item, true);
        const min_non_tradable = await this.calculatePrice(item, false);
        return { ...item, min_tradable, min_non_tradable };
      }),
    );
  }
}
