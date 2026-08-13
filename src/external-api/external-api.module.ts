import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';
import { Character } from '../characters/entities/character.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { RickAndMortyService } from './rick-and-morty.service';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Character, Episode])],
  controllers: [SeedController],
  providers: [RickAndMortyService, SeedService],
})
export class ExternalApiModule {}
