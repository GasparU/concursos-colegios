// src/ai-generator/cache/cache.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache = new Map<string, any>();

  get(key: string): any | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}
