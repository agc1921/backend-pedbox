import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodesRepository: Repository<Episode>,
  ) {}

async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<Episode>> {
  const { page = 1, limit = 10, search, sortBy = 'id', order = 'ASC' } = query;

  const qb = this.episodesRepository
    .createQueryBuilder('episode')
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy(`episode.${sortBy}`, order);

  if (search) {
    qb.andWhere('episode.name ILIKE :search', { search: `%${search}%` });
  }

  const [data, total] = await qb.getManyAndCount();
  return new PaginatedResponseDto(data, total, page, limit);
}

  async findOne(id: number): Promise<Episode | null> {
    return this.episodesRepository.findOne({
      where: { id },
      relations: { characters: true },
    });
  }
}
