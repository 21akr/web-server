import { createClient } from 'redis';

export class RedisService {
  private client: any;
  private url: string = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

  constructor() {
    this.client = createClient({ url: this.url });
    this.client.connect();
  }

  connect(): void {
    this.client.on('ready', () => {
      console.log('Redis client connected');
    });

    this.client.on('error', err => {
      console.error('Redis client connection error', err);
    });
  }

  public async set<T = string>(key: string, value: T, duration?: number): Promise<boolean> {
    try {
      this.client.set(key, value);
      if (duration) {
        this.client.expire(key, duration);
      }
      return true;
    } catch (err) {
      console.error('REDIS ERROR', err);
      throw err;
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('REDIS ERROR', err);
      throw err;
    }
  }
}
