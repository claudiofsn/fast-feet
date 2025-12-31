import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { makeOrder } from 'test/factories/make-order';
import { FetchRecentOrdersUseCase } from './fetch-recent-orders';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: FetchRecentOrdersUseCase;

describe('Fetch Recent Orders', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new FetchRecentOrdersUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch orders', async () => {
    await inMemoryOrdersRepository.create(makeOrder());
    await inMemoryOrdersRepository.create(makeOrder());
    await inMemoryOrdersRepository.create(makeOrder());

    const result = await sut.execute({ page: 1 });

    expect(result.orders).toHaveLength(3);
  });

  it('should be able to fetch paginated orders', async () => {
    for (let i = 1; i <= 22; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i); // subtrai 'i' dias à data atual

      const order = makeOrder({
        product: `Order ${i}`,
        createdAt: date,
      });

      await inMemoryOrdersRepository.create(order);
    }

    const result = await sut.execute({ page: 2 });

    expect(result.orders).toHaveLength(2);
    expect(result.orders[0].product).toEqual('Order 21');
  });
});
