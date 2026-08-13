import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Location } from '../locations/entities/location.entity';
import { Character } from '../characters/entities/character.entity';
import { Episode } from '../episodes/entities/episode.entity';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER || 'pedbox',
  password: process.env.DB_PASSWORD || 'pedbox123',
  database: process.env.DB_NAME || 'rickmorty',
  entities: [User, Location, Character, Episode],

  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
});
