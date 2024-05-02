import { createClient } from 'redis';
import { promisify } from 'util';

export class RedisService {
  private client: any;
  private url: string = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

  constructor() {
    this.client = createClient({ url: this.url });
    this.connect();
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
    const setAsync = promisify(this.client.set).bind(this.client);
    try {
      await setAsync(key, value);
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
    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      return await getAsync(key);
    } catch (err) {
      console.error('REDIS ERROR', err);
      throw err;
    }
  }
}
