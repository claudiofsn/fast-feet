import { Optional } from '@/core/types/optional';
import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export enum UserRole {
  ADMIN = 'ADMIN',
  DELIVERER = 'DELIVERER',
}

export interface UserProps {
  name: string;
  cpf: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get roles() {
    return this.props.roles;
  }

  set roles(roles: UserRole[]) {
    this.props.roles = roles;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  public hasRole(role: UserRole): boolean {
    return this.props.roles.includes(role);
  }

  public addRole(role: UserRole) {
    if (!this.hasRole(role)) {
      this.props.roles.push(role);
      this.touch();
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'roles'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        roles: props.roles ?? [UserRole.DELIVERER],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
