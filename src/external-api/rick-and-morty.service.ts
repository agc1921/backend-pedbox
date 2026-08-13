import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api';

@Injectable()
export class RickAndMortyService {
  private readonly logger = new Logger(RickAndMortyService.name);

  async fetchAllCharacters() {
    return this.fetchAllPages(`${BASE_URL}/character`);
  }

  async fetchAllLocations() {
    return this.fetchAllPages(`${BASE_URL}/location`);
  }

  async fetchAllEpisodes() {
    return this.fetchAllPages(`${BASE_URL}/episode`);
  }

  private async fetchAllPages(url: string) {
    let results: any[] = [];
    let next: string | null = url;

    while (next) {
      const data = await this.getWithRetry(next);
      results = results.concat(data.results);
      next = data.info?.next ?? null;

      if (next) {
        await this.sleep(300); 
      }
    }
    return results;
  }

  private async getWithRetry(url: string, attempt = 1): Promise<any> {
    const MAX_ATTEMPTS = 5;

    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 429 && attempt <= MAX_ATTEMPTS) {
        const retryAfterHeader = error?.response?.headers?.['retry-after'];
        const waitSeconds = retryAfterHeader ? Number(retryAfterHeader) : attempt * 2;

        this.logger.warn(
          `429 recibido en ${url} — reintentando en ${waitSeconds}s (intento ${attempt}/${MAX_ATTEMPTS})`,
        );

        await this.sleep(waitSeconds * 1000);
        return this.getWithRetry(url, attempt + 1);
      }

      throw new HttpException(
        'Error consultando la API de Rick and Morty',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}