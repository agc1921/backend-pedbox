import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repoMock: any;

  beforeEach(async () => {
    repoMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('debe buscar un usuario por email', async () => {
    const mockUser = { id: 1, email: 'test@test.com', password: 'hashed' };
    repoMock.findOne.mockResolvedValue(mockUser);

    const result = await service.findByEmail('test@test.com');

    expect(result).toEqual(mockUser);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });
  });

  it('debe devolver null si el email no existe', async () => {
    repoMock.findOne.mockResolvedValue(null);

    const result = await service.findByEmail('noexiste@test.com');

    expect(result).toBeNull();
  });

  it('debe crear un usuario con el password ya hasheado', async () => {
    const created = { id: 1, email: 'test@test.com', password: 'hashedpass' };
    repoMock.create.mockReturnValue(created);
    repoMock.save.mockResolvedValue(created);

    const result = await service.create('test@test.com', 'hashedpass');

    expect(repoMock.create).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'hashedpass',
    });
    expect(repoMock.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });
});