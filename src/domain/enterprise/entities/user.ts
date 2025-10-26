import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserProps {
  name: string;
  document: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get document() {
    return this.props.document;
  }

  set document(document: string) {
    this.props.document = document;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return user;
  }
}
