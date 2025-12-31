import { beforeEach, describe, expect, it } from 'vitest';
import { DeliverOrderUseCase } from './deliver-order';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { makeOrder } from 'test/factories/make-order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from './errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: DeliverOrderUseCase;

describe('Deliver Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new DeliverOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to deliver an order', async () => {
    const deliverymanId = new UniqueEntityID('deliveryman-01');

    const order = makeOrder({
      deliverymanId,
      startDate: new Date(),
    });

    await inMemoryOrdersRepository.create(order);

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliverymanId.toString(),
      signatureId: 'signature-01',
    });

    expect(result.order.endDate).toBeInstanceOf(Date);
    expect(result.order.signatureId?.toString()).toBe('signature-01');
    expect(inMemoryOrdersRepository.items[0].endDate).toEqual(expect.any(Date));
  });

  it('should not be able to deliver an order from another deliveryman', async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('deliveryman-01'),
      startDate: new Date(),
    });

    await inMemoryOrdersRepository.create(order);

    await expect(() =>
      sut.execute({
        orderId: order.id.toString(),
        deliverymanId: 'deliveryman-HACKER',
        signatureId: 'signature-01',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
