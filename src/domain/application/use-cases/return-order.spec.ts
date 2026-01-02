import { makeOrder } from 'test/factories/make-order';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { ReturnOrderUseCase } from './return-order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: ReturnOrderUseCase;

describe('Return Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new ReturnOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to return an order', async () => {
    const deliverymanId = new UniqueEntityID('deliveryman-1');
    const order = makeOrder({
      deliverymanId,
      startDate: new Date(),
    });

    await inMemoryOrdersRepository.create(order);

    await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliverymanId.toString(),
    });

    expect(inMemoryOrdersRepository.items[0].canceladedAt).toBeInstanceOf(Date);
    expect(inMemoryOrdersRepository.items[0].deliverymanId).toEqual(
      deliverymanId,
    );
  });

  it('should not be able to return an order from another deliveryman', async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('deliveryman-1'),
      startDate: new Date(),
    });

    await inMemoryOrdersRepository.create(order);

    await expect(() =>
      sut.execute({
        orderId: order.id.toString(),
        deliverymanId: 'other-deliveryman',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
