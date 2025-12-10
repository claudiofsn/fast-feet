import { User } from '@/domain/enterprise/entities/user';

export class UserPresenter {
  static toHTTP(this: void, user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      roles: user.roles,
    };
  }
}
