import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
  ) {}

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Character>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'id',
      order = 'ASC',
    } = query;

    const qb = this.charactersRepository
      .createQueryBuilder('character')
      .leftJoinAndSelect('character.location', 'location')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`character.${sortBy}`, order);

    if (search) {
      qb.andWhere('character.name ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: number): Promise<Character | null> {
    return this.charactersRepository.findOne({
      where: { id },
      relations: { location: true, episodes: true },
    });
  }
}
