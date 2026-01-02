import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { makeOrder } from 'test/factories/make-order';
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: FetchNearbyOrdersUseCase;

describe('Fetch Nearby Orders', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch orders', async () => {
    // Encomenda Perto (Ex: 2km)
    const orderNear = makeOrder({ latitude: -23.5, longitude: -46.6 });

    // Encomenda Longe (Ex: 20km)
    const orderFar = makeOrder({ latitude: -23.9, longitude: -46.9 });

    await inMemoryOrdersRepository.create(orderNear);
    await inMemoryOrdersRepository.create(orderFar);

    const result = await sut.execute({
      deliverymanLatitude: -23.51,
      deliverymanLongitude: -46.61,
    });

    expect(result.orders).toHaveLength(1);
    expect(result.orders[0]).toEqual(orderNear);
  });
});
