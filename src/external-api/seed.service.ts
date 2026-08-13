import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RickAndMortyService } from './rick-and-morty.service';
import { Location } from '../locations/entities/location.entity';
import { Character } from '../characters/entities/character.entity';
import { Episode } from '../episodes/entities/episode.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly rickAndMortyService: RickAndMortyService,
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
    @InjectRepository(Episode)
    private readonly episodesRepository: Repository<Episode>,
  ) {}

  async run() {
    this.logger.log('Iniciando seed desde Rick and Morty API...');

    await this.seedLocations();
    await this.seedEpisodes();
    await this.seedCharacters();

    this.logger.log('Seed completado.');
  }

  private async seedLocations() {
    const locations = await this.rickAndMortyService.fetchAllLocations();

    for (const loc of locations) {
      const existing = await this.locationsRepository.findOne({ where: { apiId: loc.id } });
      if (existing) continue; 
      const entity = this.locationsRepository.create({
        apiId: loc.id,
        name: loc.name,
        type: loc.type,
        dimension: loc.dimension,
      });
      await this.locationsRepository.save(entity);
    }
    this.logger.log(`Locations: ${locations.length} procesadas`);
  }

  private async seedEpisodes() {
    const episodes = await this.rickAndMortyService.fetchAllEpisodes();

    for (const ep of episodes) {
      const existing = await this.episodesRepository.findOne({ where: { apiId: ep.id } });
      if (existing) continue;

      const entity = this.episodesRepository.create({
        apiId: ep.id,
        name: ep.name,
        airDate: ep.air_date,
        episodeCode: ep.episode,
      });
      await this.episodesRepository.save(entity);
    }
    this.logger.log(`Episodes: ${episodes.length} procesados`);
  }

  private async seedCharacters() {
    const characters = await this.rickAndMortyService.fetchAllCharacters();

    for (const char of characters) {
      const existing = await this.charactersRepository.findOne({ where: { apiId: char.id } });
      if (existing) continue;
      
      let location: Location | null = null;
      if (char.location?.url) {
        const locationApiId = this.extractIdFromUrl(char.location.url);
        if (locationApiId) {
          location = await this.locationsRepository.findOne({ where: { apiId: locationApiId } });
        }
      }

      const episodeApiIds = char.episode
        .map((url: string) => this.extractIdFromUrl(url))
        .filter((id: number | null): id is number => id !== null);

      const episodes = await this.episodesRepository.find({
        where: { apiId: In(episodeApiIds) },
      });

      const entity = this.charactersRepository.create({
        apiId: char.id,
        name: char.name,
        status: char.status,
        species: char.species,
        gender: char.gender,
        imageUrl: char.image,
        location: location ?? undefined,
        episodes,
      });
      await this.charactersRepository.save(entity);
    }
    this.logger.log(`Characters: ${characters.length} procesados`);
  }

  private extractIdFromUrl(url: string): number | null {
    const match = url.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }
}
