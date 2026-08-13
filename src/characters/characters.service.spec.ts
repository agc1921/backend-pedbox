import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';

describe('CharactersService', () => {
  let service: CharactersService;
  let queryBuilderMock: any;

  beforeEach(async () => {
    queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: getRepositoryToken(Character),
          useValue: {
            createQueryBuilder: jest.fn(() => queryBuilderMock),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CharactersService);
  });

  it('debe devolver una lista paginada', async () => {
    queryBuilderMock.getManyAndCount.mockResolvedValue([
      [{ id: 1, name: 'Rick' }],
      1,
    ]);

    const result = await service.findAll({ page: 1, limit: 10 } as any);

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('debe aplicar el filtro de búsqueda cuando se pasa "search"', async () => {
    queryBuilderMock.getManyAndCount.mockResolvedValue([[], 0]);

    await service.findAll({ page: 1, limit: 10, search: 'rick' } as any);

    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'character.name ILIKE :search',
      { search: '%rick%' },
    );
  });

  it('debe ordenar por el campo y dirección indicados', async () => {
    queryBuilderMock.getManyAndCount.mockResolvedValue([[], 0]);

    await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'name',
      order: 'DESC',
    } as any);

    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('character.name', 'DESC');
  });

it('debe devolver el detalle de un character por id, incluyendo location y episodes', async () => {
  const repo = (service as any).charactersRepository;
  repo.findOne = jest.fn().mockResolvedValue({
    id: 1,
    name: 'Rick',
    location: { id: 1, name: 'Earth' },
    episodes: [{ id: 1, name: 'Pilot' }],
  });

  const result = await service.findOne(1);

  expect(repo.findOne).toHaveBeenCalledWith({
    where: { id: 1 },
    relations: { location: true, episodes: true }, // 👈 cambiado de array a objeto
  });
  expect(result?.location).toBeDefined();
  expect(result?.episodes).toHaveLength(1);
});
});