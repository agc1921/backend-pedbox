import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: jest.Mocked<CharactersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(CharactersController);
    service = module.get(CharactersService);
  });

  it('debe llamar a findAll con los query params recibidos', async () => {
    const mockResponse = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    service.findAll.mockResolvedValue(mockResponse as any);

    const query = { page: 1, limit: 10 } as any;
    const result = await controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(mockResponse);
  });

  it('debe llamar a findOne con el id recibido', async () => {
    const mockCharacter = { id: 1, name: 'Rick' };
    service.findOne.mockResolvedValue(mockCharacter as any);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockCharacter);
  });
});