import { FakeHasher } from 'test/cryptography/fake-hasher';
import { RegisterDeliverymanUseCase } from './register-deliveryman';
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository';

let sut: RegisterDeliverymanUseCase;
let deliverymanRepository: InMemoryDeliverymanRepository;
let fakeHasher: FakeHasher;

describe('Register Deliveryman', () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterDeliverymanUseCase(deliverymanRepository, fakeHasher);
  });

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      email: 'student@example.com',
      name: 'Student Name',
      password: 'teste123',
      document: '12345678900',
      role: DeliverymanRole.DELIVERYMAN,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      deliveryman: deliverymanRepository.items[0],
    });
  });

  it('should hash student password upon register', async () => {
    const password = 'teste123';

    const result = await sut.execute({
      email: 'student@example.com',
      name: 'Student Name',
      password,
      document: '12345678900',
      role: DeliverymanRole.DELIVERYMAN,
    });

    const hashedPassword = await fakeHasher.hash(password);

    expect(result.isRight()).toBeTruthy();
    expect(deliverymanRepository.items[0].password).toEqual(hashedPassword);
  });
});
