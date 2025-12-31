import { beforeEach, describe, expect, it } from 'vitest';
import { WithdrawOrderUseCase } from './withdraw-order';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { makeOrder } from 'test/factories/make-order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { OrderEnRoutForDeliveryError } from './errors/order-en-route-for-delivery-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: WithdrawOrderUseCase;

describe('Withdraw Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new WithdrawOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to withdraw an order', async () => {
    const order = makeOrder();
    await inMemoryOrdersRepository.create(order);

    const deliverymanId = 'deliveryman-01';

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId,
    });

    expect(result.order.deliverymanId?.toString()).toBe(deliverymanId);
    expect(result.order.startDate).toBeInstanceOf(Date);
    expect(inMemoryOrdersRepository.items[0].startDate).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to withdraw an order that does not exist', async () => {
    await expect(() =>
      sut.execute({
        orderId: 'non-existing-id',
        deliverymanId: 'deliveryman-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to withdraw an order that has already been withdrawn', async () => {
    // Criamos uma ordem que já possui um entregador
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('another-deliveryman'),
      startDate: new Date(),
    });

    await inMemoryOrdersRepository.create(order);

    await expect(() =>
      sut.execute({
        orderId: order.id.toString(),
        deliverymanId: 'deliveryman-01',
      }),
    ).rejects.toThrow(OrderEnRoutForDeliveryError);
  });
});
