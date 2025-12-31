import { beforeEach, describe, expect, it } from 'vitest';
import { MarkOrderAsWaitingUseCase } from './mark-order-as-waiting';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { makeOrder } from 'test/factories/make-order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CannotMarkOrderAsWaitingError } from './errors/cannot-mark-order-as-waiting-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: MarkOrderAsWaitingUseCase;

describe('Mark Order as Waiting', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new MarkOrderAsWaitingUseCase(inMemoryOrdersRepository);
  });

  it('should be able to mark an order as waiting', async () => {
    const order = makeOrder({
      product: 'Product 01',
      startDate: new Date(),
    });

    await inMemoryOrdersRepository.create(order);

    await sut.execute({
      orderId: order.id.toString(),
    });

    expect(inMemoryOrdersRepository.items[0].deliverymanId).toBeNull();
    expect(inMemoryOrdersRepository.items[0].startDate).toBeNull();
    expect(inMemoryOrdersRepository.items[0].updatedAt).toBeInstanceOf(Date);
  });

  it('should not be able to mark a delivered order as waiting', async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('deliveryman-1'),
      startDate: new Date(),
      endDate: new Date(),
    });

    await inMemoryOrdersRepository.create(order);

    await expect(() =>
      sut.execute({
        orderId: order.id.toString(),
      }),
    ).rejects.toBeInstanceOf(CannotMarkOrderAsWaitingError);
  });
});
