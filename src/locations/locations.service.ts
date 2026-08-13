import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<Location>> {
  const { page = 1, limit = 10, search, sortBy = 'id', order = 'ASC' } = query;

  const qb = this.locationsRepository
    .createQueryBuilder('location')
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy(`location.${sortBy}`, order);

  if (search) {
    qb.andWhere('location.name ILIKE :search', { search: `%${search}%` });
  }

  const [data, total] = await qb.getManyAndCount();
  return new PaginatedResponseDto(data, total, page, limit);
}

  async findOne(id: number): Promise<Location | null> {
    return this.locationsRepository.findOne({
      where: { id },
      relations: { characters: true },
    });
  }
}
