import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FetchUsersUseCase } from './fetch-users';
import { UserRole } from '@/domain/enterprise/entities/user';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchUsersUseCase;

describe('Fetch Users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchUsersUseCase(inMemoryUsersRepository);
  });

  it('should be able to fetch users', async () => {
    await inMemoryUsersRepository.create(
      makeUser({ roles: [UserRole.DELIVERER] }),
    );
    await inMemoryUsersRepository.create(
      makeUser({ roles: [UserRole.DELIVERER] }),
    );
    await inMemoryUsersRepository.create(
      makeUser({ roles: [UserRole.DELIVERER] }),
    );
    await inMemoryUsersRepository.create(makeUser({ roles: [UserRole.ADMIN] }));

    const result = await sut.execute({ page: 1 });

    expect(result.users).toHaveLength(3);
  });

  it('should be able to fetch paginated users', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryUsersRepository.create(
        makeUser({ name: `User ${i}`, roles: [UserRole.DELIVERER] }),
      );
    }

    const result = await sut.execute({ page: 2 });

    expect(result.users).toHaveLength(2); // 22 total - 20 da pag 1 = 2 restantes
    expect(result.users[0].name).toEqual('User 21');
  });
});
