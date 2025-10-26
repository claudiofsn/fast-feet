import { makeDeliveryman } from 'test/factories/make-deliveryman';
import { GetDeliverymanByIdUseCase } from './get-deliveryman-by-id';
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository';

let sut: GetDeliverymanByIdUseCase;
let deliverymanRepository: InMemoryDeliverymanRepository;

describe('Get Deliveryman By Id Use Case', () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    sut = new GetDeliverymanByIdUseCase(deliverymanRepository);
  });

  it('should be able to get a deliveryman by id', async () => {
    const deliveryman = makeDeliveryman();

    await deliverymanRepository.create(deliveryman);

    const result = await sut.execute({ id: deliveryman.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.deliveryman).toEqual(deliveryman);
    }
  });
});
