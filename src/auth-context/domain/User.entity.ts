import { Email } from "./Email.valueObject";
import { Password } from "./Password.valueObject";
import { UserId } from "./UserId.valueObject";
import { DomainEventPublisher } from "../../shared-kernel/events/DomainEventPublisher";
import { UserCreated } from "./UserCreated.event";
import { AggregateRoot } from "@/shared-kernel/interfaces/AggregateRoot";

export interface UserPrimitive {
  readonly id: string;
  readonly email: string;
  readonly hashedPassword: string;
}

export class User implements AggregateRoot<UserId> {
  id: UserId;
  email: Email;
  private password: Password;

  constructor(id: UserId, email: Email, password: Password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  public static async create(
    plainEmail: string,
    plainPassword: string,
  ): Promise<User> {
    const id = new UserId();
    const email = new Email(plainEmail);
    const password = await Password.fromClear(plainPassword);

    DomainEventPublisher.publish(new UserCreated(id));
    return new User(id, email, password);
  }

  public async checkPassword(clearPassword: string): Promise<boolean> {
    return this.password.compare(clearPassword);
  }

  public toPrimitives(): UserPrimitive {
    return {
      id: this.id.id(),
      email: this.email.value,
      hashedPassword: this.password.value,
    };
  }

  public static reconstitute(primitive: UserPrimitive): User {
    const id = new UserId(primitive.id);
    const email = new Email(primitive.email);
    const password = Password.fromHashed(primitive.hashedPassword);

    return new User(id, email, password);
  }

  public toAuthPayload() {
    return { email: this.email.value, id: this.id.id() };
  }
}
