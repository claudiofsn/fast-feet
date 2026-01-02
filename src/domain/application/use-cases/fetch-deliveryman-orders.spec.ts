import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { makeOrder } from 'test/factories/make-order';
import { FetchDeliverymanOrdersUseCase } from './fetch-deliveryman-orders';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: FetchDeliverymanOrdersUseCase;

describe('Fetch Deliveryman Orders', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new FetchDeliverymanOrdersUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch orders from a specific deliveryman', async () => {
    const deliverymanId = new UniqueEntityID('deliveryman-1');

    await inMemoryOrdersRepository.create(makeOrder({ deliverymanId }));
    await inMemoryOrdersRepository.create(makeOrder({ deliverymanId }));
    await inMemoryOrdersRepository.create(
      makeOrder({ deliverymanId: new UniqueEntityID('outro-entregador') }),
    );

    await inMemoryOrdersRepository.create(
      makeOrder({ deliverymanId: new UniqueEntityID('deliveryman-2') }),
    );

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 1,
    });

    expect(result.orders).toHaveLength(2);
  });

  it('should be able to fetch paginated deliveryman orders', async () => {
    const deliverymanId = new UniqueEntityID('deliveryman-1');

    for (let i = 1; i <= 22; i++) {
      await inMemoryOrdersRepository.create(makeOrder({ deliverymanId }));
    }

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 2,
    });

    expect(result.orders).toHaveLength(2);
  });
});
