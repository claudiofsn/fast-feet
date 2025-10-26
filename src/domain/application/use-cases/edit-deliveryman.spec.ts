import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { EditDeliverymanUseCase } from './edit-deliveryman';
import { makeDeliveryman } from 'test/factories/make-deliveryman';

let sut: EditDeliverymanUseCase;
let deliverymanRepository: InMemoryDeliverymanRepository;

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    sut = new EditDeliverymanUseCase(deliverymanRepository);
  });

  it('should be able to edit a deliveryman', async () => {
    const deliveryman = makeDeliveryman();

    await deliverymanRepository.create(deliveryman);

    const result = await sut.execute({
      id: deliveryman.id.toString(),
      name: 'Jane Doe',
      email: 'jane@example.com',
      document: '987654321',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.deliveryman).toEqual(deliveryman);
    }
  });
});
